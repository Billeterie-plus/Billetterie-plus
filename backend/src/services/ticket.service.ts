import { prisma } from "../lib/prisma";
import { generateQrToken } from "../utils/qrcode";
import { sendNotification } from "./notification.service";

/**
 * Marks an order as PAID, generates one Ticket per purchased seat/quantity,
 * and sends a confirmation notification. Called by both the Stripe webhook
 * and the demo-payment fallback so the logic only lives in one place.
 */
export async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: { include: { ticketType: true } }, event: true },
  });

  if (order.status === "PAID") {
    return order; // already fulfilled, avoid double-issuing tickets
  }

  const tickets = [];
  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      tickets.push({
        orderId: order.id,
        eventId: order.eventId,
        ticketTypeId: item.ticketTypeId,
        ownerId: order.userId,
        qrToken: generateQrToken(),
      });
    }
  }

  await prisma.$transaction([
    prisma.ticket.createMany({ data: tickets }),
    prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
    ...order.items.map((item) =>
      prisma.ticketType.update({
        where: { id: item.ticketTypeId },
        data: { sold: { increment: item.quantity } },
      })
    ),
  ]);

  await sendNotification({
    userId: order.userId,
    title: `Vos billets pour ${order.event.title}`,
    body: `Votre commande #${order.id} est confirmée. ${tickets.length} billet(s) disponible(s) dans "Mes billets".`,
  });

  return prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: { tickets: true },
  });
}
