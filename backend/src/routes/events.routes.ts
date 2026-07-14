import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

// Durée de rétention d'une réservation de siège avant qu'elle ne soit
// automatiquement relâchée si le paiement n'a jamais été finalisé (l'acheteur
// a fermé l'onglet Stripe, la session a expiré, etc.).
const SEAT_HOLD_MINUTES = 20;

/**
 * Public: quelques chiffres réels pour la page d'accueil (aucun chiffre
 * inventé — comptés en direct depuis la base à chaque appel).
 */
router.get("/stats", asyncHandler(async (_req, res) => {
  const [eventCount, soldAgg] = await Promise.all([
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.ticketType.aggregate({ _sum: { sold: true } }),
  ]);
  res.json({
    eventCount,
    ticketsSold: soldAgg._sum.sold || 0,
  });
}));

/** Public: browse published events, with optional filters. */
router.get("/", asyncHandler(async (req, res) => {
  const { type, q } = req.query as { type?: string; q?: string };
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      ...(type ? { type: type as any } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    include: { ticketTypes: true, organization: { select: { name: true } } },
    orderBy: { startDateTime: "asc" },
  });
  res.json(events);
}));

/** Public: event detail with live ticket availability. */
router.get("/:id", asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { ticketTypes: true, organization: { select: { name: true, logoUrl: true } } },
  });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
}));

/**
 * Public: seat map + live seat availability for an event. Also opportunistically
 * releases seats that were RESERVED by an abandoned checkout (payment never
 * completed) so they become bookable again.
 */
router.get("/:id/seats", asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) return res.status(404).json({ error: "Event not found" });

  const staleBefore = new Date(Date.now() - SEAT_HOLD_MINUTES * 60 * 1000);
  await prisma.seat.updateMany({
    where: { eventId: event.id, status: "RESERVED", reservedAt: { lt: staleBefore } },
    data: { status: "AVAILABLE", reservedAt: null },
  });

  const seats = await prisma.seat.findMany({
    where: { eventId: event.id },
    select: { id: true, ticketTypeId: true, row: true, number: true, x: true, y: true, status: true },
    orderBy: [{ row: "asc" }, { number: "asc" }],
  });

  res.json({
    seatMapEnabled: event.seatMapEnabled,
    seatMapImageUrl: event.seatMapImageUrl,
    seats,
  });
}));

export default router;
