"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "../lib/api";
import { useT } from "../lib/i18n/LanguageContext";

export default function Footer() {
  const t = useT();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <footer className="mt-16 bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Marque */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-baseline gap-0.5 text-xl font-bold tracking-tight text-white">
              My<span className="text-gold-light">Ticket</span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-white/70">{t("footer.brandDescription")}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{t("footer.navTitle")}</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/" className="hover:text-gold-light">{t("nav.events")}</Link></li>
              <li><Link href="/evenements/films" className="hover:text-gold-light">{t("nav.films")}</Link></li>
              <li><Link href="/artistes" className="hover:text-gold-light">{t("nav.artists")}</Link></li>
              <li><Link href="/carte" className="hover:text-gold-light">{t("nav.map")}</Link></li>
              <li><Link href="/#faq" className="hover:text-gold-light">{t("nav.faq")}</Link></li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{t("footer.accountTitle")}</p>
            <ul className="space-y-2 text-sm text-white/80">
              {user ? (
                <>
                  <li><Link href="/my-tickets" className="hover:text-gold-light">{t("nav.myTickets")}</Link></li>
                  {user.role === "ORGANIZER" && (
                    <li><Link href="/organizer" className="hover:text-gold-light">{t("nav.organizerSpace")}</Link></li>
                  )}
                </>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-gold-light">{t("nav.login")}</Link></li>
                  <li><Link href="/register" className="hover:text-gold-light">{t("nav.register")}</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{t("footer.legalTitle")}</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/cgv" className="hover:text-gold-light">{t("footer.cgv")}</Link></li>
              <li><Link href="/confidentialite" className="hover:text-gold-light">{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} My Ticket. {t("footer.rights")}</p>
          <div className="flex flex-col gap-0.5 sm:items-end">
            <span className="font-medium text-white/80">{t("footer.stripe")}</span>
            <span>{t("footer.paymentList")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
