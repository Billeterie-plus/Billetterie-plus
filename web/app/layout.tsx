import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "My Ticket — Trains, concerts & événements",
  description: "Achetez vos billets de train, concert et spectacle en quelques clics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {/* Décor de fond fixe, sur tout le site : formes floutées + icônes */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl animate-floaty" />
          <div
            className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-brand-light/10 blur-3xl animate-floaty"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-brand-dark/10 blur-3xl animate-floaty"
            style={{ animationDelay: "3s" }}
          />

          {/* Icônes musicales/festives flottantes */}
          <span className="absolute left-[6%] top-[12%] animate-floaty text-4xl opacity-[0.09] sm:text-5xl">🎵</span>
          <span
            className="absolute left-[85%] top-[8%] animate-floaty text-3xl opacity-[0.08] sm:text-4xl"
            style={{ animationDelay: "0.8s" }}
          >
            🎶
          </span>
          <span
            className="absolute left-[12%] top-[55%] animate-floaty text-4xl opacity-[0.08] sm:text-5xl"
            style={{ animationDelay: "2.2s" }}
          >
            🎤
          </span>
          <span
            className="absolute left-[78%] top-[42%] animate-floaty text-3xl opacity-[0.08] sm:text-4xl"
            style={{ animationDelay: "1.4s" }}
          >
            🎉
          </span>
          <span
            className="absolute left-[92%] top-[75%] animate-floaty text-4xl opacity-[0.09] sm:text-5xl"
            style={{ animationDelay: "3.4s" }}
          >
            🎫
          </span>
          <span
            className="absolute left-[20%] top-[85%] animate-floaty text-3xl opacity-[0.08] sm:text-4xl"
            style={{ animationDelay: "0.4s" }}
          >
            🥁
          </span>
        </div>

        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
