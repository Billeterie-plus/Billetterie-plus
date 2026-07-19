import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

// Commission par défaut appliquée aux nouveaux règlements (modifiable ensuite
// par l'admin, évènement par évènement, tant que le règlement n'est pas payé).
const DEFAULT_COMMISSION_RATE = 10;

/**
 * Vue admin plateforme : tous les comptes créés (acheteurs et organisateurs),
 * avec pour chacun son nombre de billets achetés et le montant total dépensé
 * (toutes commandes payées, tous organisateurs confondus).
 */
router.get("/customers", asyncHandler(async (_req: AuthedRequest, res) => {
  const users = await prisma.user.findMany({
    where: { role: { in: ["BUYER", "ORGANIZER"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      orders: { where: { status: "PAID" }, select: { totalAmount: true, createdAt: true } },
      tickets: { select: { id: true } },
    },
  });

  const customers = users.map((u: any) => {
    const totalSpent = u.orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const lastPurchaseAt = u.orders.length
      ? u.orders.reduce((latest: Date, o: any) => (o.createdAt > latest ? o.createdAt : latest), u.orders[0].createdAt)
      : null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      ticketCount: u.tickets.length,
      orderCount: u.orders.length,
      totalSpent,
      lastPurchaseAt,
    };
  });

  const summary = {
    totalAccounts: customers.length,
    totalBuyersWithPurchase: customers.filter((c: any) => c.ticketCount > 0).length,
    totalRevenue: customers.reduce((sum: number, c: any) => sum + c.totalSpent, 0),
    totalTickets: customers.reduce((sum: number, c: any) => sum + c.ticketCount, 0),
  };

  res.json({ summary, customers });
}));

/**
 * Règlements organisateurs (payouts).
 *
 * Dès qu'un évènement publié est terminé (date de fin, ou date de début si
 * pas de date de fin, dans le passé), on génère automatiquement un règlement
 * "en attente" avec la recette brute de l'évènement (commandes payées) et
 * une commission par défaut. Tant qu'il est en attente, l'admin peut ajuster
 * le % de commission ; une fois marqué "payé" (après avoir fait le virement
 * lui-même, en dehors du site), le montant est figé.
 */
async function syncPayouts() {
  const now = new Date();

  const endedEvents = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      OR: [{ endDateTime: { lt: now } }, { endDateTime: null, startDateTime: { lt: now } }],
    },
    select: { id: true, organizationId: true, payout: { select: { id: true, status: true, commissionRate: true } } },
  });

  for (const event of endedEvents) {
    // On ne retouche jamais un règlement déjà marqué payé : le montant reste figé.
    if (event.payout?.status === "PAID") continue;

    const paidTotal = await prisma.order.aggregate({
      where: { eventId: event.id, status: "PAID" },
      _sum: { totalAmount: true },
    });
    const grossRevenue = paidTotal._sum.totalAmount || 0;

    if (event.payout) {
      const rate = event.payout.commissionRate;
      const commissionAmount = Math.round(grossRevenue * (rate / 100) * 100) / 100;
      const netAmount = Math.round((grossRevenue - commissionAmount) * 100) / 100;
      await prisma.payout.update({
        where: { id: event.payout.id },
        data: { grossRevenue, commissionAmount, netAmount },
      });
    } else {
      const rate = DEFAULT_COMMISSION_RATE;
      const commissionAmount = Math.round(grossRevenue * (rate / 100) * 100) / 100;
      const netAmount = Math.round((grossRevenue - commissionAmount) * 100) / 100;
      await prisma.payout.create({
        data: {
          eventId: event.id,
          organizationId: event.organizationId,
          grossRevenue,
          commissionRate: rate,
          commissionAmount,
          netAmount,
        },
      });
    }
  }
}

router.get("/payouts", asyncHandler(async (_req: AuthedRequest, res) => {
  await syncPayouts();

  const payouts = await prisma.payout.findMany({
    orderBy: { event: { startDateTime: "desc" } },
    include: {
      event: { select: { id: true, title: true, type: true, startDateTime: true, endDateTime: true } },
      organization: { select: { name: true, owner: { select: { name: true, email: true } } } },
    },
  });

  const summary = {
    pendingCount: payouts.filter((p: any) => p.status === "PENDING").length,
    pendingNetTotal: payouts.filter((p: any) => p.status === "PENDING").reduce((s: number, p: any) => s + p.netAmount, 0),
    paidNetTotal: payouts.filter((p: any) => p.status === "PAID").reduce((s: number, p: any) => s + p.netAmount, 0),
    commissionEarnedTotal: payouts.filter((p: any) => p.status === "PAID").reduce((s: number, p: any) => s + p.commissionAmount, 0),
  };

  res.json({ summary, payouts });
}));

const updateCommissionSchema = z.object({
  commissionRate: z.number().min(0).max(100),
});

router.patch("/payouts/:id", asyncHandler(async (req: AuthedRequest, res) => {
  const payout = await prisma.payout.findUnique({ where: { id: req.params.id } });
  if (!payout) return res.status(404).json({ error: "Règlement introuvable." });
  if (payout.status === "PAID") {
    return res.status(400).json({ error: "Ce règlement est déjà marqué comme payé, la commission ne peut plus être modifiée." });
  }

  const { commissionRate } = updateCommissionSchema.parse(req.body);
  const commissionAmount = Math.round(payout.grossRevenue * (commissionRate / 100) * 100) / 100;
  const netAmount = Math.round((payout.grossRevenue - commissionAmount) * 100) / 100;

  const updated = await prisma.payout.update({
    where: { id: payout.id },
    data: { commissionRate, commissionAmount, netAmount },
  });
  res.json(updated);
}));

router.post("/payouts/:id/mark-paid", asyncHandler(async (req: AuthedRequest, res) => {
  const payout = await prisma.payout.findUnique({ where: { id: req.params.id } });
  if (!payout) return res.status(404).json({ error: "Règlement introuvable." });
  if (payout.status === "PAID") return res.json(payout);

  const updated = await prisma.payout.update({
    where: { id: payout.id },
    data: { status: "PAID", paidAt: new Date() },
  });
  res.json(updated);
}));

export default router;
