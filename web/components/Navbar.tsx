"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, clearSession } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearSession();
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand">
          My Ticket
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-brand">Événements</Link>
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
