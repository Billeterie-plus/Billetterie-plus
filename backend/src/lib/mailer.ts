import { Resend } from "resend";

// Envoi d'email transactionnel via Resend (resend.com). Tant que
// RESEND_API_KEY n'est pas défini (ex: en dev local sans compte Resend),
// on se contente de logguer le contenu de l'email dans la console au lieu
// de planter — pratique pour tester le flux de réinitialisation de mot de
// passe sans avoir configuré de vrai service d'envoi.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "My Ticket <onboarding@resend.dev>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.warn(
      `[mailer] RESEND_API_KEY non configuré — email non envoyé (simulé). À: ${to} | Sujet: ${subject}`
    );
    return;
  }

  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) {
    console.error("[mailer] Échec d'envoi via Resend:", error);
    throw new Error("Impossible d'envoyer l'email pour le moment.");
  }
}
