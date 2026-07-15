import { Resend } from "resend";

// Envoi d'email transactionnel via Resend (resend.com). Tant que
// RESEND_API_KEY n'est pas défini (ex: en dev local sans compte Resend),
// on se contente de logguer le contenu de l'email dans la console au lieu
// de planter — pratique pour tester le flux de réinitialisation de mot de
// passe sans avoir configuré de vrai service d'envoi.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Ticket Area <onboarding@resend.dev>";

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

// Couleurs reprises de la charte du site (voir tailwind.config des composants front).
const BRAND = "#1e2749";
const BRAND_DARK = "#10152b";
const GOLD = "#b8912f";
const GOLD_LIGHT = "#d4af5a";

/**
 * Habillage HTML commun à tous les emails transactionnels : bandeau avec le
 * logo "TicketArea" (Area en or, comme sur le site), un titre, un corps de
 * texte libre, un bouton d'action optionnel, et un pied de page.
 * Le HTML est volontairement écrit avec des styles inline (tables + attributs)
 * car la plupart des clients mail (Gmail, Outlook...) ignorent les balises
 * <style> et le CSS moderne.
 */
export function renderEmail(opts: {
  title: string;
  bodyHtml: string;
  buttonText?: string;
  buttonUrl?: string;
  footerNote?: string;
}): string {
  const { title, bodyHtml, buttonText, buttonUrl, footerNote } = opts;

  const buttonBlock =
    buttonText && buttonUrl
      ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 8px;">
      <tr>
        <td align="center" bgcolor="${GOLD}" style="border-radius:8px;">
          <a href="${buttonUrl}" target="_blank"
             style="display:inline-block;padding:13px 32px;font-size:15px;font-weight:600;
                    color:#ffffff;text-decoration:none;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
            ${buttonText}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:4px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;font-family:Arial,Helvetica,sans-serif;word-break:break-all;">
      Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
      <a href="${buttonUrl}" style="color:${BRAND};">${buttonUrl}</a>
    </p>`
      : "";

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:24px 12px;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0"
                 style="max-width:480px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(16,21,43,0.08);">
            <tr>
              <td align="center" bgcolor="${BRAND}"
                  style="background:linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%);padding:28px 24px;">
                <span style="font-size:26px;font-weight:800;letter-spacing:0.3px;font-family:Arial,Helvetica,sans-serif;">
                  <span style="color:#ffffff;">Ticket</span><span style="color:${GOLD_LIGHT};">Area</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 28px;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${BRAND};font-family:Arial,Helvetica,sans-serif;">
                  ${title}
                </h1>
                <div style="font-size:14.5px;line-height:1.7;color:#475569;font-family:Arial,Helvetica,sans-serif;">
                  ${bodyHtml}
                </div>
                ${buttonBlock}
              </td>
            </tr>
            <tr>
              <td bgcolor="#f8fafc" style="padding:18px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">
                  ${footerNote || "Cet email a été envoyé automatiquement par Ticket Area. Si vous n'êtes pas à l'origine de cette action, vous pouvez ignorer ce message."}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
