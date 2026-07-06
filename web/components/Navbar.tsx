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
    <nav className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-0.5 text-2xl font-bold tracking-tight text-brand">
          My<span className="text-gold">Ticket</span>
        </Link>

        <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Rechercher un concert ou une soirée..."
            className="w-full rounded-full border px-4 py-1.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-brand">Événements</Link>
          <Link href="/evenements/concerts-tamouls" className="hover:text-brand">Concerts</Link>
          <Link href="/evenements/soirees-tamoules" className="hover:text-brand">Soirées</Link>
          <Link href="/artistes" className="hover:text-brand">Artistes</Link>
          {user ? (
            <>
              <Link href="/my-tickets" className="hover:text-brand">Mes billets</Link>
              {user.role === "ORGANIZER" && (
                <Link href="/organizer" className="hover:text-brand">Espace organisateur</Link>
              )}
              <span className="text-slate-500">Bonjour, {user.name}</span>
              <button onClick={logout} className="rounded bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand">Connexion</Link>
              <Link href="/register" className="rounded bg-brand px-3 py-1.5 text-white hover:bg-brand-dark">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
