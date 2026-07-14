"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

export default function OrganizerCta() {
  const t = useT();

  return (
    <section className="mb-10 flex flex-col items-start gap-5 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <Rocket size={20} strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gold-light">{t("organizerCta.title")}</h2>
          <p className="mt-1 max-w-xl text-sm text-white/80">{t("organizerCta.subtitle")}</p>
        </div>
      </div>
      <Link
        href="/register"
        className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-brand shadow-sm transition hover:bg-white/90"
      >
        {t("organizerCta.button")}
      </Link>
    </section>
  );
}
