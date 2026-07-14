import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword, signToken } from "../lib/auth";
import { asyncHandler } from "../lib/asyncHandler";
import { sendMail } from "../lib/mailer";

const router = Router();

// Le lien de réinitialisation reste valable 1h.
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const WEB_APP_URL = process.env.WEB_APP_URL || "http://localhost:3000";

function hashResetToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["BUYER", "ORGANIZER"]).default("BUYER"),
  organizationName: z.string().optional(), // required when role === ORGANIZER
});

router.post("/register", asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name, role, organizationName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name, role } });

  if (role === "ORGANIZER") {
    await prisma.organization.create({
      data: { name: organizationName || `${name}'s organization`, ownerId: user.id },
    });
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}));

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

router.post("/login", asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}));

const forgotPasswordSchema = z.object({ email: z.string().email() });

/**
 * Demande de réinitialisation de mot de passe. Répond toujours 200 avec le
 * même message, que l'email existe ou non, pour ne pas révéler quels emails
 * sont enregistrés (énumération de comptes). Le token brut n'est envoyé que
 * par email et n'est jamais renvoyé dans la réponse HTTP.
 */
router.post("/forgot-password", asyncHandler(async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashResetToken(rawToken);
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash, resetTokenExpiresAt },
    });

    const resetUrl = `${WEB_APP_URL}/reset-password?token=${rawToken}`;
    await sendMail(
      user.email,
      "Réinitialisez votre mot de passe My Ticket",
      `<p>Bonjour ${user.name},</p>
       <p>Vous avez demandé à réinitialiser votre mot de passe sur My Ticket.</p>
       <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a> (lien valable 1 heure).</p>
       <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>`
    );
  }

  res.json({ ok: true, message: "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé." });
}));

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

router.post("/reset-password", asyncHandler(async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const resetTokenHash = hashResetToken(parsed.data.token);
  const user = await prisma.user.findUnique({ where: { resetTokenHash } });

  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return res.status(400).json({ error: "Ce lien de réinitialisation est invalide ou a expiré." });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  res.json({ ok: true });
}));

export default router;
