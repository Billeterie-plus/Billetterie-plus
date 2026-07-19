"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, clearSession } from "../lib/api";
import { useRouter } from "next/navigation";
import { useLanguage, useT } from "../lib/i18n/LanguageContext";
import { LOCALES } from "../lib/i18n/translations";
import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function NavLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="group relative py-1 text-white/85 transition hover:text-white">
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-light transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const t = useT();
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <nav
      className={`sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-brand to-brand-dark transition-shadow duration-500 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="flex items-baseline gap-0.5 text-2xl font-extrabold tracking-tight text-white">
          Ticket<span className="text-gold-light">Area</span>
        </Link>

        {/* Recherche (desktop uniquement) */}
        <div className="hidden sm:block sm:max-w-xs sm:flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("nav.searchPlaceholder")}
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white placeholder:text-white/50 transition focus:border-gold-light/50 focus:bg-white/10 focus:outline-none"
          />
        </div>

        {/* Liens (desktop uniquement) */}
        <div className="hidden items-center gap-5 text-sm sm:flex">
          <NavLink href="/">{t("nav.events")}</NavLink>
          <NavLink href="/carte">{t("nav.map")}</NavLink>
          <NavLink href="/#faq">{t("nav.faq")}</NavLink>
          {user ? (
            <>
              <NavLink href="/my-tickets">{t("nav.myTickets")}</NavLink>
              {user.role === "ORGANIZER" && <NavLink href="/organizer">{t("nav.organizerSpace")}</NavLink>}
              {user.role === "ADMIN" && (
                <>
                  <NavLink href="/admin/customers">{t("nav.admin")}</NavLink>
                  <NavLink href="/admin/payouts">{t("nav.payouts")}</NavLink>
                </>
              )}
              <span className="text-white/50">{t("nav.hello", { name: user.name })}</span>
              <button onClick={logout} className="rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/15">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">{t("nav.login")}</NavLink>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 font-medium text-white shadow-md shadow-gold/20 transition hover:scale-105 hover:shadow-lg hover:shadow-gold/30"
              >
                {t("nav.register")}
              </Link>
            </>
          )}

          <div className="flex items-center gap-0.5 rounded-full bg-white/5 p-0.5">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                onClick={() => setLocale(l.value)}
                className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                  locale === l.value ? "bg-gold-light text-brand-dark" : "text-white/60 hover:text-white"
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
          className="relative rounded-lg p-2 hover:bg-white/10 sm:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Panneau menu (mobile uniquement) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-brand-dark sm:hidden"
          >
            <div className="px-4 py-4">
              <div className="relative">
                <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full rounded-full border border-white/15 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/50 focus:border-gold-light/50 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="mt-4 flex flex-col gap-1 text-[15px]">
                <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                  {t("nav.events")}
                </Link>
                <Link href="/carte" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                  {t("nav.map")}
                </Link>
                <Link href="/#faq" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                  {t("nav.faq")}
                </Link>
                {user && (
                  <>
                    <Link href="/my-tickets" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                      {t("nav.myTickets")}
                    </Link>
                    {user.role === "ORGANIZER" && (
                      <Link href="/organizer" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                        {t("nav.organizerSpace")}
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <>
                        <Link href="/admin/customers" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                          {t("nav.admin")}
                        </Link>
                        <Link href="/admin/payouts" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                          {t("nav.payouts")}
                        </Link>
                      </>
                    )}
                  </>
                )}
                {!user && (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-white/85 hover:bg-white/10">
                    {t("nav.login")}
                  </Link>
                )}
              </div>

              <div className="mt-4 border-t border-white/10 pt-4">
                {user ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/60">{t("nav.hello", { name: user.name })}</span>
                    <button onClick={logout} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                      {t("nav.logout")}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-gradient-to-r from-gold to-gold-dark px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    {t("nav.register")}
                  </Link>
                )}
              </div>

              <div className="mt-4 flex w-fit items-center gap-0.5 rounded-full bg-white/5 p-0.5">
                {LOCALES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLocale(l.value)}
                    className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                      locale === l.value ? "bg-gold-light text-brand-dark" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
