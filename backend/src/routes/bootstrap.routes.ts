import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

/**
 * Point d'entrée exceptionnel pour promouvoir un compte en ADMIN sans passer
 * par un terminal : visiter cette URL dans un navigateur suffit.
 *
 * Protégé par la variable d'environnement ADMIN_BOOTSTRAP_SECRET : la route
 * répond 404 tant que cette variable n'est pas définie sur Railway, et exige
 * qu'elle corresponde exactement au paramètre ?secret= fourni. Une fois
 * l'admin créé, supprimez cette variable d'environnement pour désactiver
 * la route.
 *
 * Exemple d'usage :
 *   https://<votre-backend>.up.railway.app/bootstrap/promote-admin?email=vous@exemple.com&secret=VOTRE_SECRET
 */
router.get("/promote-admin", asyncHandler(async (req, res) => {
  const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!configuredSecret) {
    return res.status(404).send("Not found");
  }

  const { email, secret } = req.query as { email?: string; secret?: string };
  if (secret !== configuredSecret) {
    return res.status(403).send("Secret incorrect.");
  }
  if (!email) {
    return res.status(400).send("Ajoutez ?email=votre@email.com à l'adresse.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(404)
      .send(`Aucun compte trouvé pour ${email}. Créez d'abord un compte sur le site (bouton "Créer un compte"), puis réessayez.`);
  }

  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });

  res.send(
    `OK — ${email} est maintenant administrateur. Déconnectez-vous puis reconnectez-vous sur le site pour voir apparaître le lien "Admin". Pensez ensuite à supprimer la variable d'environnement ADMIN_BOOTSTRAP_SECRET sur Railway.`
  );
}));

export default router;
