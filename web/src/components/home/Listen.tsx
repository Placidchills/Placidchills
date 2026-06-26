import { site } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const tracks = [
  "https://open.spotify.com/embed/track/2tSIlY71TUNHNvYEHSQe5l?utm_source=generator&theme=0",
  "https://open.spotify.com/embed/track/5VJKAoXZIZcX7Mw1aPCEvB?utm_source=generator&theme=0",
  "https://open.spotify.com/embed/track/4dKfhIpkYyXUgmNDFSLR7j?utm_source=generator&theme=0",
];

export function Listen() {
  return (
    <section id="listen">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div className="section-eyebrow">Listen</div>
            <h2 className="section-title">The work, before you buy it.</h2>
            <p className="section-desc">
              Stream the catalog. If a production moves you, the beat is
              available to license — or reach out about a custom record.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="tracks-grid">
            {tracks.map((src) => (
              <div key={src} className="track-embed">
                <iframe
                  src={src}
                  width="100%"
                  height="152"
                  allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture"
                  loading="lazy"
                  title="Spotify track"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="listen-links">
            <a
              href={site.social.spotify}
              target="_blank"
              rel="noopener"
              className="listen-link"
            >
              <span>Full catalog on Spotify</span>
              <span className="listen-link-arrow">→</span>
            </a>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener"
              className="listen-link"
            >
              <span>YouTube</span>
              <span className="listen-link-arrow">→</span>
            </a>
            <span className="listen-link disabled">
              <span>Bandcamp — coming soon</span>
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
