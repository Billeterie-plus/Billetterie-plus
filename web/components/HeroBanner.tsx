"use client";

import { useState } from "react";

export default function HeroBanner() {
  const [videoOk, setVideoOk] = useState(true);

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

      {/* Formes flottantes pour donner du mouvement même sans vidéo */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl animate-floaty" />
      <div
        className="pointer-events-none absolute -bottom-10 right-10 h-52 w-52 rounded-full bg-white/10 blur-2xl animate-floaty"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 p-8 sm:p-12">
        <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide animate-fadeInUp">
          🎉 La plateforme n°1 des concerts & soirées tamoules
        </p>
        <h1 className="max-w-xl text-3xl font-bold drop-shadow-sm sm:text-4xl animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          My Ticket, la scène tamoule à portée de clic
        </h1>
        <p className="mt-3 max-w-xl text-white/90 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          Concerts d'artistes tamouls, soirées Kollywood, Pongal party... découvrez, réservez et vivez les meilleurs événements
          de la scène tamoule, en quelques secondes et sans commission cachée.
        </p>

        {/* Mini pitch : pourquoi choisir My Ticket */}
        <div className="mt-5 flex flex-wrap gap-2 animate-fadeInUp" style={{ animationDelay: "0.25s" }}>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            🎤 37+ artistes tamouls référencés
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            ⚡ Billets instantanés, sans file d'attente
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            🔒 Paiement 100% sécurisé
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            📲 Billet directement sur votre téléphone
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 animate-fadeInUp" style={{ animationDelay: "0.35s" }}>
          <button
            onClick={scrollToEvents}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Voir les événements
          </button>
          <a
            href="/artistes"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Découvrir les artistes
          </a>
        </div>
      </div>
    </div>
  );
}
