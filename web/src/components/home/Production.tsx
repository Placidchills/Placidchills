import Link from "next/link";
import { formatInr, pricing, site } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ExclusiveBanner() {
  return (
    <section>
      <div className="wrap">
        <ScrollReveal>
          <div className="banner glass">
            <h2>Want a beat off the market for good?</h2>
            <p>
              Exclusive rights mean the beat is yours the moment you buy it —
              retired from the store, never licensed to anyone else. Typically{" "}
              {formatInr(pricing.beats.exclusiveFrom)}–
              {formatInr(pricing.beats.exclusiveTo)} depending on the beat.
            </p>
            <Link href="#contact" className="btn btn-primary">
              Make an offer
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Production() {
  const includes = [
    "Artist consultation & reference deep-dive",
    "Custom composition from scratch",
    "Full arrangement & structure",
    "Sound design & sampling",
    "Revisions until it's right",
    "Exclusive ownership options",
    "Mastering-ready stem delivery",
  ];

  return (
    <section id="production">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head centered">
            <div className="section-eyebrow">Custom Production</div>
            <h2 className="section-title">Built for your record.</h2>
            <p className="section-desc">
              From concept to finished instrumental. Custom production tailored
              to your artistic identity, references and release goals. Not a
              template. Not a type beat.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="prod-layout">
            <div className="prod-includes glass">
              <div className="prod-includes-title">What&apos;s included</div>
              <ul className="prod-list">
                {includes.map((item) => (
                  <li key={item}>
                    <span className="prod-check">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="prod-cta-wrap">
              <div className="prod-quote-card glass" style={{ flex: 1 }}>
                <div className="prod-quote-eyebrow">
                  Every project is scoped uniquely
                </div>
                <p className="prod-quote-text">
                  No fixed rate card. Production is priced around what
                  you&apos;re building, where it&apos;s going, and what it needs
                  to sound like. Exclusive rights typically run{" "}
                  {formatInr(pricing.beats.exclusiveFrom)}–
                  {formatInr(pricing.beats.exclusiveTo)}. Reach out with your
                  references and I&apos;ll come back with a quote within{" "}
                  {pricing.customProduction.responseHours} hours.
                </p>
                <Link href="#contact" className="btn btn-primary prod-cta-btn">
                  Request Production Quote
                </Link>
              </div>
              <div className="prod-note-card glass">
                <span className="prod-note-icon">↩</span>
                <p className="prod-note-text">
                  <strong>{site.genres.join(", ")}</strong> —{" "}
                  {site.experienceYears} years of production experience across
                  Hip-Hop and electronic music, with real releases and real
                  listeners to show for it.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
