// Usage : npx tsx prisma/promote-admin.ts email@exemple.com
//
// Passe le compte correspondant à cet email au rôle ADMIN, pour lui donner
// accès à la page /admin/customers du site (liste de tous les comptes créés
// et de leurs dépenses). Le compte doit déjà exister (créé via /register).
//
// Sur Railway : Backend service -> onglet "Command" (ou via Railway CLI
// `railway run npx tsx prisma/promote-admin.ts email@exemple.com`), pour que
// le script utilise bien la vraie base de données de production.
//
// Après promotion, il faut se déconnecter puis se reconnecter sur le site
// pour obtenir un nouveau jeton avec le rôle ADMIN à jour.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx prisma/promote-admin.ts email@exemple.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Aucun compte trouvé pour ${email}. Créez d'abord un compte via /register.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
  console.log(`✅ ${updated.email} (${updated.name}) est maintenant ADMIN.`);
  console.log("Déconnectez-vous puis reconnectez-vous sur le site pour que ça prenne effet.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
