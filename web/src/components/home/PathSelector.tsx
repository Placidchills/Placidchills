import Link from "next/link";
import { formatInr, pricing } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function PathSelector() {
  return (
    <section className="path-section">
      <div className="wrap">
        <ScrollReveal>
          <p className="path-intro">What brings you here?</p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="path-grid">
            <Link href="#beats" className="path-card">
              <span className="path-icon">▶</span>
              <span className="path-title">License a Beat</span>
              <p className="path-desc">
                Browse ready-made productions. Preview, pick a tier, and check
                out directly — no DMs needed.
              </p>
              <span className="path-price">
                From {formatInr(pricing.beats.mp3)}
              </span>
              <span className="path-arrow">→</span>
            </Link>
            <Link href="#mastering" className="path-card">
              <span className="path-icon">◎</span>
              <span className="path-title">Get Mastered</span>
              <p className="path-desc">
                Send your finished mix. Get back a release-ready master in 48
                hours or less, guaranteed.
              </p>
              <span className="path-price">
                From {formatInr(pricing.mastering.single)} per track
              </span>
              <span className="path-arrow">→</span>
            </Link>
            <Link href="#production" className="path-card path-featured">
              <span className="path-icon">✦</span>
              <span className="path-title">Commission Production</span>
              <p className="path-desc">
                Build your record from concept to finished instrumental,
                tailored to your identity and release goals.
              </p>
              <span className="path-price">
                Custom quote · {pricing.customProduction.responseHours}hr
                response
              </span>
              <span className="path-arrow">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
