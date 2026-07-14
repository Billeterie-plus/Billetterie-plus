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
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
