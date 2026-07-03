import QRCode from "qrcode";
import { nanoid } from "nanoid";

/** Generates a unique, hard-to-guess token to embed in a ticket's QR code. */
export function generateQrToken(): string {
  return `TKT-${nanoid(24)}`;
}

/** Renders a QR code for a given token as a base64 PNG data URL. */
export async function renderQrDataUrl(token: string): Promise<string> {
  return QRCode.toDataURL(token, { errorCorrectionLevel: "M", margin: 1, width: 320 });
}
