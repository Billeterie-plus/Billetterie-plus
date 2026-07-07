import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "My Ticket — La billetterie de la scène tamoule",
  description:
    "My Ticket est la billetterie de référence pour les concerts d'artistes tamouls et les soirées de la scène tamoule en France. Réservation simple, sécurisée et instantanée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
            <div className="rounded-3xl bg-[#f6f7fb] p-4 shadow-2xl sm:p-8">{children}</div>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
