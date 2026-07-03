import { prisma } from "../lib/prisma";

/**
 * Stub notification service. In production, wire this to a real provider:
 * - Email: Resend, SendGrid, Postmark
 * - Push: Expo Push API (for the React Native app), Firebase Cloud Messaging
 *
 * For now it just logs and records a Notification row so the rest of the
 * app (order confirmations, promo announcements, reminders) has a single
 * integration point to call.
 */
export async function sendNotification(opts: {
  userId: string;
  title: string;
  body: string;
  channel?: "EMAIL" | "PUSH";
}) {
  const { userId, title, body, channel = "EMAIL" } = opts;

  const notification = await prisma.notification.create({
    data: { userId, title, body, channel, status: "SENT" },
  });

  // Replace with real provider call, e.g.:
  // await resend.emails.send({ to: user.email, subject: title, text: body });
  console.log(`[notification:${channel}] -> user ${userId}: ${title}`);

  return notification;
}
