"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal from "./Reveal";

export default function OrganizerCta() {
  const t = useT();

  return (
    <Reveal>
      <section className="relative mb-10 flex flex-col items-start gap-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-6 text-white shadow-xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-[80px]" aria-hidden />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-[80px]" aria-hidden />
        <div className="relative flex items-start gap-4">
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-light ring-1 ring-white/10"
          >
            <Rocket size={20} strokeWidth={2} />
          </motion.span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-gold-light">{t("organizerCta.title")}</h2>
            <p className="mt-1 max-w-xl text-sm text-white/75">{t("organizerCta.subtitle")}</p>
          </div>
        </div>
        <Link
          href="/register"
          className="relative shrink-0 rounded-xl bg-gradient-to-r from-gold-light via-gold to-fuchsia-400 px-5 py-2.5 text-sm font-bold text-brand-dark shadow-md transition hover:scale-105 hover:shadow-lg"
        >
          {t("organizerCta.button")}
        </Link>
      </section>
    </Reveal>
  );
}
