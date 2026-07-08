import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

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

export default router;
