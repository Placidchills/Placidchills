import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

export function Hero() {
  return (
    <header className="hero">
      <div className="eyebrow">{site.tagline}</div>
      <Image
        src="/logo.png"
        alt={site.name}
        width={520}
        height={120}
        className="hero-logo"
        priority
      />
      <p className="hero-sub">
        Building records from concept to master. Custom production, professional
        mastering, and beats available to license.
      </p>
      <div className="hero-ctas">
        <Link href="#production" className="btn btn-primary">
          Commission Custom Production
        </Link>
        <Link href="#beats" className="btn btn-ghost">
          Browse Beats
        </Link>
      </div>
      <div className="hero-trust" aria-label="Credentials">
        <div className="trust-item">
          <span className="trust-num">{site.stats.monthlyListeners}</span>
          <span className="trust-label">Monthly Listeners</span>
        </div>
        <span className="trust-sep" aria-hidden="true">
          ·
        </span>
        <div className="trust-item">
          <span className="trust-num">{site.experienceYears}+</span>
          <span className="trust-label">Years Experience</span>
        </div>
        <span className="trust-sep" aria-hidden="true">
          ·
        </span>
        <div className="trust-item">
          <span className="trust-num">{site.stats.releasedRecords}</span>
          <span className="trust-label">Released Records</span>
        </div>
      </div>
      <div className="hero-bars" aria-hidden="true">
        {[10, 22, 8, 28, 14, 32, 10, 26, 18, 8, 30, 12, 24].map((h, i) => (
          <span
            key={i}
            style={
              {
                "--h": `${h}px`,
                animationDelay: `${i * 0.12}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </header>
  );
}
