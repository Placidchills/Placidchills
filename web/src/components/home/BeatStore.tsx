"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Beat } from "@/lib/beats";
import { formatInr, pricing } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BeatToast } from "@/components/home/BeatToast";

type Tier = "mp3" | "wav" | "stems";

const TIER_LABELS: Record<Tier, string> = {
  mp3: "MP3 Lease",
  wav: "WAV Lease",
  stems: "Stems Lease",
};

const TIER_PRICES: Record<Tier, number> = {
  mp3: pricing.beats.mp3,
  wav: pricing.beats.wav,
  stems: pricing.beats.stems,
};

const FILTERS = ["all", "drill", "trap", "boom-bap"] as const;

function BeatCard({
  beat,
  index,
  onPlayStart,
}: {
  beat: Beat;
  index: number;
  onPlayStart: () => void;
}) {
  const id = `b${index}`;
  const [tier, setTier] = useState<Tier>("wav");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tierUrl = {
    mp3: beat.mp3Url,
    wav: beat.wavUrl,
    stems: beat.stemsUrl,
  }[tier];

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio?.src || !beat.previewUrl) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
      onPlayStart();
    }
  }, [beat.previewUrl, onPlayStart, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  return (
    <div className="beat-card" data-genre={beat.genre}>
      <div className="beat-art" onClick={togglePlay} role="button" tabIndex={0}>
        <div className="beat-art-bg" style={{ background: beat.gradient }} />
        <div className={`beat-play ${playing ? "playing" : ""}`}>
          <svg className="icon-play" width="18" height="18" viewBox="0 0 18 18">
            <path d="M5 3.5L14.5 9 5 14.5V3.5z" />
          </svg>
          <svg className="icon-pause" width="18" height="18" viewBox="0 0 18 18">
            <rect x="4" y="3" width="4" height="12" rx="1" />
            <rect x="10" y="3" width="4" height="12" rx="1" />
          </svg>
        </div>
        <div className="beat-waveform">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              style={{ height: `${6 + ((i * 7) % 24)}px` }}
            />
          ))}
        </div>
        <div className="beat-progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="beat-body">
        <div className="beat-name">{beat.name}</div>
        <div className="beat-meta">
          <span className="beat-tag highlight">
            {beat.genre.replace("-", " ").toUpperCase()}
          </span>
          <span className="beat-tag">{beat.bpm} BPM</span>
          <span className="beat-tag">{beat.key}</span>
        </div>
        <div className="beat-tiers">
          {(["mp3", "wav", "stems"] as Tier[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`tier-btn ${tier === t ? "selected" : ""}`}
              style={t === "wav" ? { position: "relative" } : undefined}
              onClick={() => setTier(t)}
            >
              {t.toUpperCase()}
              {t === "wav" && (
                <span className="tier-popular-badge">POPULAR</span>
              )}
            </button>
          ))}
        </div>
        <div className="beat-price">{formatInr(TIER_PRICES[tier])}</div>
        <div className="beat-trust">
          Instant download · License included · Secure
        </div>
        <a
          href={tierUrl}
          target="_blank"
          rel="noopener"
          className="btn btn-primary beat-cta"
        >
          Buy — {TIER_LABELS[tier]}
        </a>
      </div>
      <audio ref={audioRef} id={`audio-${id}`} src={beat.previewUrl || undefined} />
    </div>
  );
}

export function BeatStore({ beats, live }: { beats: Beat[]; live: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [toastShown, setToastShown] = useState(false);

  const filtered =
    filter === "all" ? beats : beats.filter((b) => b.genre === filter);

  return (
    <section id="beats">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div className="section-eyebrow">Beat Store</div>
            <h2 className="section-title">License a beat.</h2>
            <p className="section-desc">
              Preview, pick a tier, check out directly. No DMs. WAV selected by
              default — what most artists prefer.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="store-toolbar">
            <div className="store-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
            <span className="airtable-badge">
              ● {live ? "Live" : "Sample beats"} · {beats.length} beats
            </span>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="beats-grid">
            {filtered.map((beat, i) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                index={i}
                onPlayStart={() => {
                  if (!toastShown) {
                    setTimeout(() => setToastShown(true), 3000);
                  }
                }}
              />
            ))}
          </div>
        </ScrollReveal>
        <p className="note" data-reveal>
          Beat previews stream from uploaded files.{" "}
          <a href="#contact">Get in touch</a> about exclusive rights (
          {formatInr(pricing.beats.exclusiveFrom)}–
          {formatInr(pricing.beats.exclusiveTo)}) or custom production.
        </p>
      </div>
      <BeatToast show={toastShown} onClose={() => setToastShown(false)} />
    </section>
  );
}
