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
    include: { items: { include: { ticketType: true, seat: true } }, event: true },
  });

  if (!stripe) {
    // Demo mode: no Stripe key configured -> auto-confirm the order.
    await fulfillOrder(orderId);
    return { mode: "demo" as const, redirectUrl: `${WEB_APP_URL}/my-tickets?order=${orderId}` };
  }

  // Infos pratiques de l'événement (adresse, transport, parking) affichées
  // directement sur la page de paiement Stripe, pour que l'acheteur les ait
  // sous les yeux au moment de payer.
  const eventDateStr = new Date(order.event.startDateTime).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const practicalParts: string[] = [`${eventDateStr}`];
  if (order.event.venue) practicalParts.push(`Adresse : ${order.event.venue}`);
  if (order.event.transportInfo) practicalParts.push(`Transport : ${order.event.transportInfo}`);
  if (order.event.parkingInfo || order.event.parkingFree !== null) {
    const label =
      order.event.parkingFree === true ? "Parking gratuit" : order.event.parkingFree === false ? "Parking payant" : "Parking";
    practicalParts.push(order.event.parkingInfo ? `${label} : ${order.event.parkingInfo}` : label);
  }
  // Stripe limite ce message à 499 caractères.
  const practicalInfo = practicalParts.join(" — ").slice(0, 499);

  const lineItems = order.items.map((item: any) => ({
    quantity: item.quantity,
    price_data: {
      currency: order.currency.toLowerCase(),
      unit_amount: Math.round(item.unitPrice * 100),
      product_data: {
        name: item.seat
          ? `${order.event.title} — ${item.ticketType.name} (Rangée ${item.seat.row}, Place ${item.seat.number})`
          : `${order.event.title} — ${item.ticketType.name}`,
        // Repris aussi ici (sous le nom du billet), au cas où le client ne
        // remarque pas le message près du bouton de paiement.
        description: practicalInfo.slice(0, 300) || undefined,
      },
    },
  }));

  const baseParams = {
    mode: "payment" as const,
    line_items: lineItems,
    success_url: `${WEB_APP_URL}/my-tickets?order=${orderId}&success=true`,
    cancel_url: `${WEB_APP_URL}/checkout?cancelled=true`,
    metadata: { orderId },
    custom_text: practicalInfo
      ? { submit: { message: practicalInfo } }
      : undefined,
  };

  let session;
  try {
    // "card" fait apparaître automatiquement Google Pay / Apple Pay comme
    // wallets natifs selon l'appareil du client (rien à configurer en plus).
    // "paypal" doit être activé dans Stripe Dashboard → Paramètres → Moyens
    // de paiement pour être proposé.
    session = await stripe.checkout.sessions.create({
      ...baseParams,
      payment_method_types: ["card", "paypal"],
    });
  } catch (err: any) {
    // Si PayPal n'est pas encore activé sur le compte Stripe, on ne bloque pas
    // le paiement : on retombe sur carte bancaire seule (qui fonctionne toujours).
    if (err?.code === "parameter_invalid_enum" || /paypal/i.test(err?.message || "")) {
      console.warn("PayPal indisponible sur ce compte Stripe, retour à carte bancaire seule:", err.message);
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        payment_method_types: ["card"],
      });
    } else {
      throw err;
    }
  }

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
