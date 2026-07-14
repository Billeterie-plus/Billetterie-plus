"use client";

import { useState } from "react";
import { useT } from "../lib/i18n/LanguageContext";

const QUESTION_KEYS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FaqSection() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section
      id="faq"
      className="mb-10 mt-16 scroll-mt-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg sm:p-6"
    >
      <h2 className="mb-2 text-2xl font-bold text-gold-light">{t("faq.title")}</h2>
      <p className="mb-8 text-sm text-white/70">{t("faq.subtitle")}</p>

      <div className="mx-auto max-w-3xl space-y-3">
        {QUESTION_KEYS.map((n) => {
          const isOpen = open === n;
          return (
            <div key={n} className="overflow-hidden rounded-xl border bg-white">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : n)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{t(`faq.q${n}`)}</span>
                <span
                  className={`shrink-0 text-lg text-brand transition-transform ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t px-5 py-4 text-sm leading-relaxed text-slate-600">{t(`faq.a${n}`)}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
