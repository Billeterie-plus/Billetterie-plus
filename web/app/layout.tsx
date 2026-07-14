import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "My Ticket — La billetterie de la scène Tamil",
  description:
    "My Ticket est la billetterie de référence pour les concerts d'artistes Tamil, les soirées de la scène Tamil et les films en salle en France. Réservation simple, sécurisée et instantanée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          {/* Fond discret, fixe sur tout le site */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/[0.06] blur-3xl" />
            <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-brand-light/[0.06] blur-3xl" />
            <div className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-brand-dark/[0.05] blur-3xl" />
          </div>

          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
