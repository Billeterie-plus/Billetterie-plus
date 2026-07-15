"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, clearSession } from "../lib/api";
import { useRouter } from "next/navigation";
import { useLanguage, useT } from "../lib/i18n/LanguageContext";
import { LOCALES } from "../lib/i18n/translations";
import { Menu, Search, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const t = useT();
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearSession();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  function handleSearch() {
    setMenuOpen(false);
    router.push(search.trim() ? `/?q=${encodeURIComponent(search.trim())}#evenements` : "/#evenements");
  }

  const linkClass = "hover:text-gold-light";

  return (
    <nav className="sticky top-0 z-20 bg-brand text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-0.5 text-2xl font-bold tracking-tight text-white">
          Ticket<span className="text-gold-light">Area</span>
        </Link>

        {/* Recherche (desktop uniquement) */}
        <div className="hidden sm:block sm:max-w-xs sm:flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("nav.searchPlaceholder")}
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400"
          />
        </div>

        {/* Liens (desktop uniquement) */}
        <div className="hidden items-center gap-4 text-sm text-white/90 sm:flex">
          <Link href="/" className={linkClass}>{t("nav.events")}</Link>
          <Link href="/carte" className={linkClass}>{t("nav.map")}</Link>
          <Link href="/#faq" className={linkClass}>{t("nav.faq")}</Link>
          {user ? (
            <>
              <Link href="/my-tickets" className={linkClass}>{t("nav.myTickets")}</Link>
              {user.role === "ORGANIZER" && (
                <Link href="/organizer" className={linkClass}>{t("nav.organizerSpace")}</Link>
              )}
              {user.role === "ADMIN" && (
                <>
                  <Link href="/admin/customers" className={linkClass}>{t("nav.admin")}</Link>
                  <Link href="/admin/payouts" className={linkClass}>{t("nav.payouts")}</Link>
                </>
              )}
              <span className="text-white/70">{t("nav.hello", { name: user.name })}</span>
              <button onClick={logout} className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>{t("nav.login")}</Link>
              <Link href="/register" className="rounded bg-gold px-3 py-1.5 font-medium text-white hover:bg-gold-dark">
                {t("nav.register")}
              </Link>
            </>
          )}

          <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                onClick={() => setLocale(l.value)}
                className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                  locale === l.value ? "bg-white text-brand" : "text-white/70 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton menu (mobile uniquement) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          className="rounded-lg p-2 hover:bg-white/10 sm:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Panneau menu (mobile uniquement) */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-dark px-4 py-4 sm:hidden">
          <div className="relative">
            <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("nav.searchPlaceholder")}
              className="w-full rounded-full border border-white/20 bg-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400"
            />
          </div>

          <div className="mt-4 flex flex-col gap-1 text-[15px]">
            <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
              {t("nav.events")}
            </Link>
            <Link href="/carte" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
              {t("nav.map")}
            </Link>
            <Link href="/#faq" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
              {t("nav.faq")}
            </Link>
            {user && (
              <>
                <Link href="/my-tickets" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
                  {t("nav.myTickets")}
                </Link>
                {user.role === "ORGANIZER" && (
                  <Link href="/organizer" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
                    {t("nav.organizerSpace")}
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link href="/admin/customers" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
                      {t("nav.admin")}
                    </Link>
                    <Link href="/admin/payouts" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
                      {t("nav.payouts")}
                    </Link>
                  </>
                )}
              </>
            )}
            {!user && (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-white/10">
                {t("nav.login")}
              </Link>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white/70">{t("nav.hello", { name: user.name })}</span>
                <button onClick={logout} className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-gold-dark"
              >
                {t("nav.register")}
              </Link>
            )}
          </div>

          <div className="mt-4 flex w-fit items-center gap-0.5 rounded-full bg-white/10 p-0.5">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                onClick={() => setLocale(l.value)}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                  locale === l.value ? "bg-white text-brand" : "text-white/70 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
