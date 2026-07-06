import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { createCheckoutSession } from "../services/payment.service";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const createOrderSchema = z.object({
  eventId: z.string(),
  items: z.array(z.object({ ticketTypeId: z.string(), quantity: z.number().int().min(1) })).min(1),
  promoCode: z.string().optional(),
});

/** Creates a PENDING order, validates stock, applies promo code, returns a checkout redirect URL. */
router.post("/", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { eventId, items, promoCode } = parsed.data;

  const ticketTypes = await prisma.ticketType.findMany({
    where: { id: { in: items.map((i) => i.ticketTypeId) }, eventId },
  });

  for (const item of items) {
    const tt = ticketTypes.find((t: any) => t.id === item.ticketTypeId);
    if (!tt) return res.status(400).json({ error: `Unknown ticket type ${item.ticketTypeId}` });
    if (tt.sold + item.quantity > tt.quota) {
      return res.status(409).json({ error: `Not enough availability for "${tt.name}"` });
    }
  }

  let subtotal = 0;
  for (const item of items) {
    const tt = ticketTypes.find((t: any) => t.id === item.ticketTypeId)!;
    subtotal += tt.price * item.quantity;
  }

  let promo = null;
  let total = subtotal;
  if (promoCode) {
    promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
    if (!promo || (promo.eventId && promo.eventId !== eventId)) {
      return res.status(400).json({ error: "Invalid promo code" });
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ error: "Promo code expired" });
    }
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ error: "Promo code fully redeemed" });
    }
    total =
      promo.discountType === "PERCENT"
        ? subtotal * (1 - promo.discountValue / 100)
        : Math.max(0, subtotal - promo.discountValue);
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user!.userId,
      eventId,
      totalAmount: total,
      promoCodeId: promo?.id,
      items: {
        create: items.map((item) => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPrice: ticketTypes.find((t: any) => t.id === item.ticketTypeId)!.price,
        })),
      },
    },
    include: { items: true },
  });

  if (promo) {
    await prisma.promoCode.update({ where: { id: promo.id }, data: { usedCount: { increment: 1 } } });
  }

  let checkout;
  try {
    checkout = await createCheckoutSession(order.id);
  } catch (err: any) {
    console.error("createCheckoutSession failed for order", order.id, err);
    return res.status(502).json({
      error:
        "Le service de paiement n'a pas répondu correctement. Votre commande a été enregistrée mais aucun paiement n'a été lancé — réessayez dans un instant.",
    });
  }
  res.status(201).json({ orderId: order.id, ...checkout });
}));

router.get("/:id", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { ticketType: true } }, tickets: true, event: true },
  });
  if (!order || order.userId !== req.user!.userId) return res.status(404).json({ error: "Not found" });
  res.json(order);
}));

export default router;
