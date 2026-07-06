import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "My Ticket — La billetterie de la scène tamoule",
  description:
    "My Ticket est la billetterie de référence pour les concerts d'artistes tamouls et les soirées de la scène tamoule en France. Réservation simple, sécurisée et instantanée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {/* Fond discret, fixe sur tout le site */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/[0.06] blur-3xl" />
          <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-brand-light/[0.06] blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-brand-dark/[0.05] blur-3xl" />
        </div>

        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
