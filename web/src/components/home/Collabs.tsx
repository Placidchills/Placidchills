import { ScrollReveal } from "@/components/ui/ScrollReveal";

const collabs = [
  {
    label: "BANTAI RECORDS — EMIWAY BANTAI",
    title: "KAUN HAI?",
    track: "GAUSH × FLOWBO, prod. Placidchills",
    stat: "Official music video · Bantai Records 2022",
  },
  {
    label: "KALAM INK",
    title: "AAJ BHI AAP",
    track: "6.4M streams · 2× Editorial playlist",
    stat: "Bambai Bantai — Taaza Hai Bro! · Spotify",
  },
  {
    label: "GRAVERO",
    title: "Lo-Fi Edits",
    track: "Ajab Si Remake — 580K+ YouTube views",
    stat: "Millions of views across the collab series",
  },
];

export function Collabs() {
  return (
    <section id="collabs">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div className="section-eyebrow">Credentials</div>
            <h2 className="section-title">Who&apos;s trusted the sound.</h2>
            <p className="section-desc">
              Production and mastering work that reached millions — with names
              that matter in the DHH scene.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="collab-grid">
            {collabs.map((c) => (
              <div key={c.title} className="collab-card glass">
                <div className="collab-card-label">{c.label}</div>
                <h3>{c.title}</h3>
                <div className="collab-card-track">{c.track}</div>
                <div className="collab-card-stat">{c.stat}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
