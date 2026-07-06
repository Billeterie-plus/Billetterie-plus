import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const organizerPassword = await hashPassword("password123");
  const buyerPassword = await hashPassword("password123");

  const organizerUser = await prisma.user.upsert({
    where: { email: "organisateur@demo.com" },
    update: {},
    create: {
      email: "organisateur@demo.com",
      passwordHash: organizerPassword,
      name: "Demo Organisateur",
      role: "ORGANIZER",
    },
  });

  const org = await prisma.organization.upsert({
    where: { ownerId: organizerUser.id },
    update: {},
    create: { name: "Demo Events & Voyages", ownerId: organizerUser.id },
  });

  await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: { email: "client@demo.com", passwordHash: buyerPassword, name: "Demo Client", role: "BUYER" },
  });

  const tamilConcert1 = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Anirudh Ravichander Live — Tournée XV",
      description: "Concert événement du compositeur et interprète tamoul Anirudh Ravichander, entre tubes Kollywood et énergie électro.",
      type: "CONCERT",
      venue: "Zénith, Paris",
      startDateTime: new Date(Date.now() + 45 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "Fosse", price: 45, quota: 800, seated: false },
          { name: "Carré Or", price: 95, quota: 150, seated: false },
        ],
      },
    },
  });

  const tamilConcert2 = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Sid Sriram — Carnatic & Soul Tour",
      description: "Le chanteur tamoul Sid Sriram mêle musique carnatique traditionnelle et R&B contemporain sur scène.",
      type: "CONCERT",
      venue: "Salle Pleyel, Paris",
      startDateTime: new Date(Date.now() + 60 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "Catégorie 2", price: 39, quota: 400, seated: true },
          { name: "Catégorie 1", price: 69, quota: 150, seated: true },
        ],
      },
    },
  });

  const soiree1 = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Kollywood Night — Soirée Tamoule",
      description: "Soirée tamoule avec DJ set 100% Kollywood : Anirudh, Yuvan Shankar Raja, Harris Jayaraj et tubes Gana.",
      type: "SOIREE",
      venue: "Le Trabendo, Paris",
      startDateTime: new Date(Date.now() + 21 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "Entrée simple", price: 15, quota: 300, seated: false },
          { name: "VIP (accès bar dédié)", price: 30, quota: 60, seated: false },
        ],
      },
    },
  });

  const soiree2 = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Chennai Nights — Soirée Tamoule",
      description: "Grande soirée tamoule : musique, danse et ambiance festive toute la nuit.",
      type: "SOIREE",
      venue: "La Bellevilloise, Paris",
      startDateTime: new Date(Date.now() + 90 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "Entrée simple", price: 12, quota: 350, seated: false },
          { name: "Table réservée (4 pers.)", price: 120, quota: 20, seated: true },
        ],
      },
    },
  });

  await prisma.promoCode.create({
    data: {
      organizationId: org.id,
      eventId: tamilConcert1.id,
      code: "BIENVENUE10",
      discountType: "PERCENT",
      discountValue: 10,
      maxUses: 100,
    },
  });

  console.log("Seed complete:");
  console.log("  Organizer login -> organisateur@demo.com / password123");
  console.log("  Buyer login     -> client@demo.com / password123");
  console.log(
    `  Events created  -> "${tamilConcert1.title}", "${tamilConcert2.title}", "${soiree1.title}", "${soiree2.title}"`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
