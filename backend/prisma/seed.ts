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

  const concert = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Nuit Électro — Warehouse Paris",
      description: "Une soirée électro avec les meilleurs DJs de la scène parisienne.",
      type: "CONCERT",
      venue: "Warehouse, Paris",
      startDateTime: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "Fosse", price: 35, quota: 500, seated: false },
          { name: "Carré Or", price: 75, quota: 100, seated: false },
        ],
      },
    },
  });

  const train = await prisma.event.create({
    data: {
      organizationId: org.id,
      title: "Paris → Lyon Express",
      description: "Trajet direct, départ matinal.",
      type: "TRAIN",
      departureStation: "Paris Gare de Lyon",
      arrivalStation: "Lyon Part-Dieu",
      startDateTime: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      status: "PUBLISHED",
      ticketTypes: {
        create: [
          { name: "2nde classe", price: 45, quota: 300, seated: true },
          { name: "1ère classe", price: 89, quota: 80, seated: true },
        ],
      },
    },
  });

  await prisma.promoCode.create({
    data: {
      organizationId: org.id,
      eventId: concert.id,
      code: "BIENVENUE10",
      discountType: "PERCENT",
      discountValue: 10,
      maxUses: 100,
    },
  });

  console.log("Seed complete:");
  console.log("  Organizer login -> organisateur@demo.com / password123");
  console.log("  Buyer login     -> client@demo.com / password123");
  console.log(`  Events created  -> "${concert.title}", "${train.title}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
