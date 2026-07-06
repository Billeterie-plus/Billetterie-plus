"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, clearSession } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearSession();
    setUser(null);
    router.push("/");
  }

  function handleSearch() {
    router.push(search.trim() ? `/?q=${encodeURIComponent(search.trim())}#evenements` : "/#evenements");
  }

  return (
    <nav className="sticky top-0 z-10 bg-brand text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-0.5 text-2xl font-bold tracking-tight text-white">
          My<span className="text-gold-light">Ticket</span>
        </Link>

        <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Rechercher un concert ou une soirée..."
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-white/90">
          <Link href="/" className="hover:text-gold-light">Événements</Link>
          <Link href="/artistes" className="hover:text-gold-light">Artistes</Link>
          {user ? (
            <>
              <Link href="/my-tickets" className="hover:text-gold-light">Mes billets</Link>
              {user.role === "ORGANIZER" && (
                <Link href="/organizer" className="hover:text-gold-light">Espace organisateur</Link>
              )}
              <span className="text-white/70">Bonjour, {user.name}</span>
              <button onClick={logout} className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gold-light">Connexion</Link>
              <Link href="/register" className="rounded bg-gold px-3 py-1.5 font-medium text-white hover:bg-gold-dark">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
