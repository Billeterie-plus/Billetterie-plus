import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { createCheckoutSession } from "../services/payment.service";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const createOrderSchema = z.object({
  eventId: z.string(),
  items: z
    .array(
      z.object({
        ticketTypeId: z.string(),
        quantity: z.number().int().min(1),
        // Rempli quand la catégorie fait partie d'un plan de salle : l'acheteur a
        // choisi ses sièges précis plutôt qu'une simple quantité.
        seatIds: z.array(z.string()).optional(),
      })
    )
    .min(1),
  promoCode: z.string().optional(),
});

/** Creates a PENDING order, validates stock (and reserves seats if any), applies promo code, returns a checkout redirect URL. */
router.post("/", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { eventId, items, promoCode } = parsed.data;

  const ticketTypes = await prisma.ticketType.findMany({
    where: { id: { in: items.map((i) => i.ticketTypeId) }, eventId },
  });

  // Pour les catégories avec sièges, la quantité réelle est le nombre de
  // sièges choisis (on ignore une éventuelle quantité incohérente envoyée
  // par le client).
  const normalizedItems = items.map((item) => ({
    ...item,
    quantity: item.seatIds?.length ? item.seatIds.length : item.quantity,
  }));

  for (const item of normalizedItems) {
    const tt = ticketTypes.find((t: any) => t.id === item.ticketTypeId);
    if (!tt) return res.status(400).json({ error: `Unknown ticket type ${item.ticketTypeId}` });
    if (!item.seatIds?.length && tt.sold + item.quantity > tt.quota) {
      return res.status(409).json({ error: `Not enough availability for "${tt.name}"` });
    }
  }

  let subtotal = 0;
  for (const item of normalizedItems) {
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

  const allSeatIds = normalizedItems.flatMap((item) => item.seatIds || []);

  let order;
  try {
    order = await prisma.$transaction(async (tx: any) => {
      // Réserve atomiquement chaque siège demandé : l'update ne réussit que
      // s'il est encore AVAILABLE, ce qui évite qu'un même siège soit vendu à
      // deux acheteurs en même temps.
      if (allSeatIds.length) {
        const { count } = await tx.seat.updateMany({
          where: { id: { in: allSeatIds }, eventId, status: "AVAILABLE" },
          data: { status: "RESERVED", reservedAt: new Date() },
        });
        if (count !== allSeatIds.length) {
          throw Object.assign(new Error("Un ou plusieurs sièges viennent d'être pris. Merci de réessayer."), {
            status: 409,
          });
        }
      }

      return tx.order.create({
        data: {
          userId: req.user!.userId,
          eventId,
          totalAmount: total,
          promoCodeId: promo?.id,
          items: {
            create: normalizedItems.flatMap((item) => {
              const unitPrice = ticketTypes.find((t: any) => t.id === item.ticketTypeId)!.price;
              if (item.seatIds?.length) {
                return item.seatIds.map((seatId) => ({
                  ticketTypeId: item.ticketTypeId,
                  quantity: 1,
                  unitPrice,
                  seatId,
                }));
              }
              return [{ ticketTypeId: item.ticketTypeId, quantity: item.quantity, unitPrice }];
            }),
          },
        },
        include: { items: true },
      });
    });
  } catch (err: any) {
    if (err.status === 409) return res.status(409).json({ error: err.message });
    throw err;
  }

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
