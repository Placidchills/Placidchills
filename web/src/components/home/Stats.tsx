import { site } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Stats() {
  return (
    <section id="proof" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <ScrollReveal>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-num">{site.stats.totalStreams}</div>
              <div className="stat-label">Streams across the catalog</div>
            </div>
            <div className="stat">
              <div className="stat-num">{site.stats.topTrackStreams}</div>
              <div className="stat-label">
                Streams on {site.stats.topTrackName} alone
              </div>
            </div>
            <div className="stat">
              <div className="stat-num">
                {String(site.stats.editorialPlacements).padStart(2, "0")}
              </div>
              <div className="stat-label">Spotify Editorial placements</div>
            </div>
            <div className="stat">
              <div className="stat-num">{site.stats.monthlyListeners}</div>
              <div className="stat-label">Monthly listeners</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    { label: "Collabs", text: "GAUSH — FLOWBO — KALAM INK — BANTAI RECORDS — GRAVERO — FILTH INC. — BROOSNICA" },
    { label: "Editorial", text: "BAMBAI BANTAI — TAAZA HAI BRO!" },
  ];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <b>{item.label}</b>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
