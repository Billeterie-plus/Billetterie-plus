"use client";

import { useRef, useState } from "react";
import { Headphones, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

/**
 * Lecteur audio par artiste. Cherche un extrait dans /public/artists-audio/{slug}.mp3
 * (fichier à déposer par l'organisateur, voir public/artists-audio/README.md).
 * Si le fichier n'existe pas, affiche un message discret au lieu de planter.
 */
export default function ArtistAudioPlayer({ slug, name }: { slug: string; name: string }) {
  const t = useT();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <audio
        ref={audioRef}
        src={`/artists-audio/${slug}.mp3`}
        loop
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
        onEnded={() => setPlaying(false)}
      />

      {error ? (
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Headphones size={16} strokeWidth={2} /> {t("audioPlayer.noAudio", { name })}
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            disabled={loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:scale-105 hover:bg-brand-dark disabled:opacity-60"
            aria-label={playing ? t("audioPlayer.pause") : t("audioPlayer.listen")}
          >
            {loading ? (
              "…"
            ) : playing ? (
              <Pause size={16} strokeWidth={2} fill="currentColor" />
            ) : (
              <Play size={16} strokeWidth={2} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {playing ? t("audioPlayer.playing", { name }) : t("audioPlayer.listenTo", { name })}
            </p>
            {playing && (
              <div className="mt-1.5 flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1 animate-floaty rounded-full bg-brand"
                    style={{ height: `${8 + (i % 3) * 4}px`, animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition hover:bg-slate-50"
            aria-label={muted ? t("audioPlayer.unmute") : t("audioPlayer.mute")}
          >
            {muted ? <VolumeX size={15} strokeWidth={2} /> : <Volume2 size={15} strokeWidth={2} />}
          </button>
        </div>
      )}
    </div>
  );
}
