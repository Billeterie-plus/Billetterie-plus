"use client";

import { useState } from "react";
import { useT } from "../lib/i18n/LanguageContext";

export default function HeroBanner() {
  const [videoOk, setVideoOk] = useState(true);
  const t = useT();

  function scrollToEvents() {
    document.getElementById("evenements")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl text-white">
      {/* Fond : vidéo si disponible (public/videos/hero.mp4), sinon dégradé animé */}
      {videoOk && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-brand via-brand-light to-brand-dark bg-200 animate-gradientMove ${
          videoOk ? "opacity-60" : "opacity-100"
        }`}
      />

      <div className="relative z-10 p-8 sm:p-12">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gold-light animate-fadeInUp">
          {t("hero.label")}
        </p>
        <h1 className="max-w-xl text-3xl font-bold drop-shadow-sm sm:text-4xl animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          {t("hero.title")}
        </h1>
        <p className="mt-3 max-w-xl text-white/90 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          {t("hero.subtitle")}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/80 animate-fadeInUp" style={{ animationDelay: "0.25s" }}>
          <span>{t("hero.stat1")}</span>
          <span>{t("hero.stat2")}</span>
          <span>{t("hero.stat3")}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={scrollToEvents}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
          >
            {t("hero.cta1")}
          </button>
          <a
            href="/artistes"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t("hero.cta2")}
          </a>
        </div>
      </div>
    </div>
  );
}
