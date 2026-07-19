import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth, requireRole("ORGANIZER", "ADMIN"));

async function getOrgOrFail(userId: string) {
  const org = await prisma.organization.findUnique({ where: { ownerId: userId } });
  if (!org) throw Object.assign(new Error("No organization for this user"), { status: 404 });
  return org;
}

/** Organization profile of the logged-in organizer. */
router.get("/me", asyncHandler(async (req: AuthedRequest, res) => {
  const org = await getOrgOrFail(req.user!.userId).catch((e) => null);
  if (!org) return res.status(404).json({ error: "No organization found for this account" });
  res.json(org);
}));

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["TRAIN", "CONCERT", "SOIREE", "FILM", "SPORT", "THEATRE", "OTHER"]),
  imageUrl: z.string().optional(),
  venue: z.string().optional(),
  departureStation: z.string().optional(),
  arrivalStation: z.string().optional(),
  transportInfo: z.string().optional(),
  parkingInfo: z.string().optional(),
  parkingFree: z.boolean().nullable().optional(),
  startDateTime: z.string(), // ISO string
  endDateTime: z.string().optional(),
  ticketTypes: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        currency: z.string().default("EUR"),
        quota: z.number().int().min(1),
        seated: z.boolean().default(false),
      })
    )
    .min(1),
  // Plan de salle interactif optionnel : une image de la salle sur laquelle
  // l'organisateur a positionné des sièges cliquables (rattachés à un tarif
  // via son index dans le tableau ticketTypes ci-dessus).
  seatMap: z
    .object({
      enabled: z.boolean(),
      imageUrl: z.string().optional(),
      seats: z
        .array(
          z.object({
            tierIndex: z.number().int().min(0),
            row: z.string().min(1),
            number: z.string().min(1),
            x: z.number().min(0).max(100),
            y: z.number().min(0).max(100),
          })
        )
        .optional(),
    })
    .optional(),
});

/** List this organizer's events (any status). */
router.get("/events", asyncHandler(async (req: AuthedRequest, res) => {
  const org = await getOrgOrFail(req.user!.userId);
  const events = await prisma.event.findMany({
    where: { organizationId: org.id },
    include: { ticketTypes: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(events);
}));

/** Create an event with its ticket types (tiers/zones/wagons...) and, optionally, a seat map. */
router.post("/events", asyncHandler(async (req: AuthedRequest, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const org = await getOrgOrFail(req.user!.userId);
  const { ticketTypes, seatMap, ...data } = parsed.data;

  const seatMapEnabled = !!(seatMap?.enabled && seatMap.imageUrl && seatMap.seats?.length);

  const event = await prisma.event.create({
    data: {
      ...data,
      startDateTime: new Date(data.startDateTime),
      endDateTime: data.endDateTime ? new Date(data.endDateTime) : undefined,
      organizationId: org.id,
      seatMapEnabled,
      seatMapImageUrl: seatMapEnabled ? seatMap!.imageUrl : undefined,
    },
  });

  // Créés séquentiellement (plutôt qu'en createMany) pour connaître l'id de
  // chaque catégorie créée et pouvoir y rattacher les sièges du plan de salle
  // par index (le formulaire ne connaît que la position du tarif, pas son id
  // définitif tant que l'évènement n'existe pas encore).
  const createdTicketTypes: any[] = [];
  for (const tier of ticketTypes) {
    createdTicketTypes.push(await prisma.ticketType.create({ data: { ...tier, eventId: event.id } }));
  }

  if (seatMapEnabled && seatMap!.seats?.length) {
    await prisma.seat.createMany({
      data: seatMap!.seats
        .filter((s) => createdTicketTypes[s.tierIndex])
        .map((s) => ({
          eventId: event.id,
          ticketTypeId: createdTicketTypes[s.tierIndex].id,
          row: s.row,
          number: s.number,
          x: s.x,
          y: s.y,
        })),
    });
  }

  const full = await prisma.event.findUniqueOrThrow({
    where: { id: event.id },
    include: { ticketTypes: true, seats: true },
  });
  res.status(201).json(full);
}));

/** Update event status (DRAFT -> PUBLISHED -> CANCELLED) or details. */
router.patch("/events/:id", asyncHandler(async (req: AuthedRequest, res) => {
  const org = await getOrgOrFail(req.user!.userId);
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event || event.organizationId !== org.id) return res.status(404).json({ error: "Not found" });

  const patchSchema = eventSchema.partial().omit({ ticketTypes: true, seatMap: true }).extend({
    status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
  });
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { startDateTime, endDateTime, ...rest } = parsed.data;
  const updated = await prisma.event.update({
    where: { id: event.id },
    data: {
      ...rest,
      ...(startDateTime ? { startDateTime: new Date(startDateTime) } : {}),
      ...(endDateTime ? { endDateTime: new Date(endDateTime) } : {}),
    },
  });
  res.json(updated);
}));

/** Sales dashboard for one event: revenue, tickets sold per tier, check-in rate. */
router.get("/events/:id/stats", asyncHandler(async (req: AuthedRequest, res) => {
  const org = await getOrgOrFail(req.user!.userId);
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { ticketTypes: true, orders: { where: { status: "PAID" } }, tickets: true },
  });
  if (!event || event.organizationId !== org.id) return res.status(404).json({ error: "Not found" });

  const revenue = event.orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
  const ticketsSold = event.ticketTypes.reduce((sum: number, t: any) => sum + t.sold, 0);
  const checkedIn = event.tickets.filter((t: any) => t.status === "USED").length;

  res.json({
    eventId: event.id,
    title: event.title,
    revenue,
    currency: event.ticketTypes[0]?.currency || "EUR",
    ticketsSold,
    checkedIn,
    perTier: event.ticketTypes.map((t: any) => ({ name: t.name, sold: t.sold, quota: t.quota, price: t.price })),
  });
}));

/** Promo codes management. */
router.post("/promo-codes", asyncHandler(async (req: AuthedRequest, res) => {
  const org = await getOrgOrFail(req.user!.userId);
  const schema = z.object({
    code: z.string().min(3),
    discountType: z.enum(["PERCENT", "FIXED"]),
    discountValue: z.number().min(0),
    eventId: z.string().optional(),
    maxUses: z.number().int().optional(),
    expiresAt: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const promo = await prisma.promoCode.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
      organizationId: org.id,
    },
  });
  res.status(201).json(promo);
}));

/** Scan / validate a ticket at the entrance (used by the organizer scan screen). */
router.post("/scan", asyncHandler(async (req: AuthedRequest, res) => {
  const schema = z.object({ qrToken: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const org = await getOrgOrFail(req.user!.userId);
  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: parsed.data.qrToken },
    include: { event: true, ticketType: true, owner: { select: { name: true, email: true } } },
  });

  if (!ticket || ticket.event.organizationId !== org.id) {
    return res.status(404).json({ valid: false, reason: "Ticket introuvable pour cet organisateur" });
  }
  if (ticket.status === "USED") {
    return res.status(409).json({ valid: false, reason: "Billet déjà scanné", checkedInAt: ticket.checkedInAt });
  }
  if (ticket.status === "CANCELLED") {
    return res.status(409).json({ valid: false, reason: "Billet annulé" });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "USED", checkedInAt: new Date() },
  });

  res.json({
    valid: true,
    ticket: {
      id: updated.id,
      event: ticket.event.title,
      tier: ticket.ticketType.name,
      seatInfo: ticket.seatInfo,
      owner: ticket.owner.name,
      checkedInAt: updated.checkedInAt,
    },
  });
}));

export default router;
