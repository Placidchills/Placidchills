import { ScrollReveal } from "@/components/ui/ScrollReveal";

const testimonials = [
  {
    quote:
      "Replace this with a real quote from GAUSH, Flowbo, or any artist you've worked with. Even two or three sentences is enough — authenticity matters more than length.",
    author: "GAUSH",
    role: "Artist — DHH",
  },
  {
    quote:
      "Replace this with a mastering client quote. What was the experience like? What did the master do for the record?",
    author: "Filth Inc.",
    role: "Label — Electronic",
  },
  {
    quote:
      "Replace this with a third quote — ideally from a different service type (beat licensing, custom production) to show range across what you offer.",
    author: "KALAM INK",
    role: "Artist — DHH",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div className="section-eyebrow">What Artists Say</div>
            <h2 className="section-title">
              From the people who&apos;ve worked with it.
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.author} className="testimonial-card glass">
                <span className="testimonial-open">&ldquo;</span>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
        <p className="note" style={{ textAlign: "center", marginTop: 20 }}>
          Replace placeholder quotes with real ones from artists you&apos;ve
          worked with — this section becomes one of the highest-converting
          elements on the site.
        </p>
      </div>
    </section>
  );
}

const credits = [
  "GAUSH",
  "Flowbo",
  "KALAM INK",
  "slowdd",
  "Bantai Records",
  "Filth Inc.",
  "Broosnica",
  "Gravero",
  "Spotify — Bambai Bantai",
  "Spotify — Taaza hai bro!",
];

export function Credits() {
  return (
    <section id="credits">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <div className="section-eyebrow">Credits</div>
            <h2 className="section-title">Who&apos;s been in the room.</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="credits-wall">
            {credits.map((c) => (
              <span key={c} className="credit-chip">
                {c}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
