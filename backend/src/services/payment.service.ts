import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { fulfillOrder } from "./ticket.service";

const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2024-06-20" }) : null;

const WEB_APP_URL = process.env.WEB_APP_URL || "http://localhost:3000";

/**
 * Creates a checkout session for an order.
 * - If STRIPE_SECRET_KEY is configured, uses real Stripe Checkout (test mode
 *   keys work out of the box for a full sandbox payment flow).
 * - Otherwise falls back to a "demo payment" that immediately fulfills the
 *   order, so the whole app is runnable/demoable with zero external setup.
 */
export async function createCheckoutSession(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: { include: { ticketType: true } }, event: true },
  });

  if (!stripe) {
    // Demo mode: no Stripe key configured -> auto-confirm the order.
    await fulfillOrder(orderId);
    return { mode: "demo" as const, redirectUrl: `${WEB_APP_URL}/my-tickets?order=${orderId}` };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: order.currency.toLowerCase(),
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: { name: `${order.event.title} — ${item.ticketType.name}` },
      },
    })),
    success_url: `${WEB_APP_URL}/my-tickets?order=${orderId}&success=true`,
    cancel_url: `${WEB_APP_URL}/checkout/${order.eventId}?cancelled=true`,
    metadata: { orderId },
  });

  await prisma.order.update({ where: { id: orderId }, data: { stripeSessionId: session.id } });

  return { mode: "stripe" as const, redirectUrl: session.url! };
}

/** Handles the `checkout.session.completed` Stripe webhook event. */
export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await fulfillOrder(orderId);
    }
  }
}
