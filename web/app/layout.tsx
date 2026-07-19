import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../lib/i18n/LanguageContext";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ticket Area — La billetterie de la scène Tamil",
  description:
    "Ticket Area est la billetterie de référence pour les concerts d'artistes Tamil, les soirées de la scène Tamil et les films en salle en France. Réservation simple, sécurisée et instantanée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="relative flex min-h-screen flex-col font-sans">
        <div className="bg-grain" aria-hidden />
        <LanguageProvider>
          <Navbar />
          <main className="relative z-[1] mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
