import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/** Public: browse published events, with optional filters. */
router.get("/", async (req, res) => {
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
});

/** Public: event detail with live ticket availability. */
router.get("/:id", async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { ticketTypes: true, organization: { select: { name: true, logoUrl: true } } },
  });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

export default router;
