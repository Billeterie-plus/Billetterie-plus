import { Router } from "express";
import { stripe, handleStripeWebhookEvent } from "../services/payment.service";

const router = Router();

// NOTE: this route must be mounted with express.raw() (see src/index.ts),
// not express.json(), because Stripe signature verification needs the raw body.
router.post("/stripe", async (req, res) => {
  if (!stripe) return res.status(400).send("Stripe not configured");

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return res.status(400).send("Missing signature/secret");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  await handleStripeWebhookEvent(event);
  res.json({ received: true });
});

export default router;
