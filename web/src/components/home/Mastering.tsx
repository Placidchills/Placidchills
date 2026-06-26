"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatInr, pricing } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    num: "01",
    title: "Upload Your Mix",
    desc: "Send a WAV or AIFF via Drive or WeTransfer with any reference tracks and loudness targets.",
  },
  {
    num: "02",
    title: "Technical Review",
    desc: "Every mix is assessed for headroom, low-end issues and any frequency problems before mastering begins.",
  },
  {
    num: "03",
    title: "Mastering",
    desc: "EQ, compression, saturation and stereo treatment to make your record translate across every system.",
  },
  {
    num: "04",
    title: "Loudness Optimization",
    desc: "Platform-specific metering for Spotify, Apple Music, YouTube and radio — wherever your record is going.",
  },
  {
    num: "05",
    title: "Final Delivery",
    desc: "WAV master to your Drive. One revision round included. Turnaround confirmed at booking.",
  },
];

function BeforeAfterPlayer({
  originalUrl,
  masterUrl,
}: {
  originalUrl: string;
  masterUrl: string;
}) {
  const [track, setTrack] = useState<"original" | "master">("original");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState("0:00");
  const origRef = useRef<HTMLAudioElement>(null);
  const mastRef = useRef<HTMLAudioElement>(null);

  const getAudio = () =>
    track === "original" ? origRef.current : mastRef.current;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  useEffect(() => {
    [origRef, mastRef].forEach((ref) => {
      const a = ref.current;
      if (!a) return;
      const onTime = () => {
        if (a.duration) setTime(fmt(a.currentTime));
      };
      const onEnd = () => setPlaying(false);
      a.addEventListener("timeupdate", onTime);
      a.addEventListener("ended", onEnd);
    });
  }, []);

  const togglePlay = () => {
    const a = getAudio();
    if (!a?.src) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {});
      setPlaying(true);
    }
  };

  const switchTrack = (next: "original" | "master") => {
    if (next === track) return;
    const old = getAudio();
    const was = playing;
    const pos = old?.currentTime ?? 0;
    old?.pause();
    setTrack(next);
    setTimeout(() => {
      const nw = next === "original" ? origRef.current : mastRef.current;
      if (nw?.duration) nw.currentTime = Math.min(pos, nw.duration);
      if (was) nw?.play().catch(() => {});
      else setPlaying(false);
    }, 0);
  };

  return (
    <div className="ba-section glass">
      <div className="ba-header">
        <h3>Hear the difference.</h3>
        <p>Toggle between the original mix and the Placidchills master.</p>
      </div>
      <div className="ba-toggle">
        <button
          type="button"
          className={`ba-btn ${track === "original" ? "active" : ""}`}
          onClick={() => switchTrack("original")}
        >
          Original Mix
        </button>
        <button
          type="button"
          className={`ba-btn ${track === "master" ? "active" : ""}`}
          onClick={() => switchTrack("master")}
        >
          Placidchills Master
        </button>
      </div>
      <div className="ba-player-row">
        <button
          type="button"
          className={`ba-play-btn ${playing ? "playing" : ""}`}
          id="ba-play"
          onClick={togglePlay}
        >
          <svg className="ba-icon-play" width="18" height="18" viewBox="0 0 18 18">
            <path d="M5 3.5L14.5 9 5 14.5V3.5z" />
          </svg>
          <svg className="ba-icon-pause" width="18" height="18" viewBox="0 0 18 18">
            <rect x="4" y="3" width="4" height="12" rx="1" />
            <rect x="10" y="3" width="4" height="12" rx="1" />
          </svg>
        </button>
        <div className="ba-waveform-wrap">
          <div className="ba-waveform">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: `${10 + ((i * 5) % 38)}px`,
                  borderRadius: 2,
                  background: "var(--accent-soft)",
                  minHeight: 4,
                }}
              />
            ))}
          </div>
        </div>
        <span className="ba-time">{time}</span>
      </div>
      <div className="ba-track-label">
        {track === "original" ? "ORIGINAL MIX" : "PLACIDCHILLS MASTER"}
      </div>
      <audio ref={origRef} id="ba-audio-original" src={originalUrl} />
      <audio ref={mastRef} id="ba-audio-master" src={masterUrl} />
    </div>
  );
}

export function Mastering() {
  return (
    <section id="mastering">
      <div className="wrap">
        <div className="master-layout">
          <ScrollReveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="section-eyebrow">Mastering</div>
              <h2 className="section-title">
                Mastering, without the back-and-forth.
              </h2>
              <p className="section-desc">
                Send a rough mix, get back a release-ready master. Standard
                turnaround {pricing.mastering.turnaroundHours} hours, rush
                available.
              </p>
              <div className="master-cta-row">
                <Link href="#contact" className="btn btn-primary">
                  Start a request
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="master-list">
              <div className="master-row">
                <div>
                  <div className="master-row-name">Single track</div>
                  <div className="master-row-meta">
                    {pricing.mastering.turnaroundHours}HR TURNAROUND
                  </div>
                </div>
                <div className="master-row-price">
                  {formatInr(pricing.mastering.single)}
                </div>
              </div>
              <div className="master-row">
                <div>
                  <div className="master-row-name">EP bundle</div>
                  <div className="master-row-meta">
                    {pricing.mastering.epTracks} TRACKS
                  </div>
                </div>
                <div className="master-row-price">
                  {formatInr(pricing.mastering.epBundle)}
                </div>
              </div>
              <div className="master-row">
                <div>
                  <div className="master-row-name">Rush delivery</div>
                  <div className="master-row-meta">
                    {pricing.mastering.rushHours}HR TURNAROUND
                  </div>
                </div>
                <div className="master-row-price">
                  +{formatInr(pricing.mastering.rushAddon)}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div
            className="section-head"
            style={{ marginTop: 80, marginBottom: 0 }}
          >
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-title">Five steps to a finished master.</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="process-grid">
            {steps.map((s) => (
              <div key={s.num} className="process-step">
                <div className="step-number">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {pricing.masteringSamples.originalUrl &&
          pricing.masteringSamples.masterUrl && (
            <ScrollReveal>
              <BeforeAfterPlayer
                originalUrl={pricing.masteringSamples.originalUrl}
                masterUrl={pricing.masteringSamples.masterUrl}
              />
            </ScrollReveal>
          )}
      </div>
    </section>
  );
}
