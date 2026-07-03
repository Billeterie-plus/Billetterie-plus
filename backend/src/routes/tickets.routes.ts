import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { renderQrDataUrl } from "../utils/qrcode";

const router = Router();

/** The authenticated user's e-tickets (used by "My tickets" in web + mobile). */
router.get("/mine", requireAuth, async (req: AuthedRequest, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { ownerId: req.user!.userId },
    include: { event: true, ticketType: true },
    orderBy: { createdAt: "desc" },
  });

  const withQr = await Promise.all(
    tickets.map(async (t) => ({ ...t, qrDataUrl: await renderQrDataUrl(t.qrToken) }))
  );

  res.json(withQr);
});

router.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: { event: true, ticketType: true },
  });
  if (!ticket || ticket.ownerId !== req.user!.userId) return res.status(404).json({ error: "Not found" });
  res.json({ ...ticket, qrDataUrl: await renderQrDataUrl(ticket.qrToken) });
});

export default router;
