import { fetchBeatsFromAirtable } from "@/lib/beats";
import { Hero } from "@/components/home/Hero";
import { PathSelector } from "@/components/home/PathSelector";
import { EarlyCapture } from "@/components/home/EarlyCapture";
import { Stats, Marquee } from "@/components/home/Stats";
import { Collabs } from "@/components/home/Collabs";
import { Listen } from "@/components/home/Listen";
import { BeatStore } from "@/components/home/BeatStore";
import { ExclusiveBanner, Production } from "@/components/home/Production";
import { Mastering } from "@/components/home/Mastering";
import { Credits } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function HomePage() {
  const live = Boolean(
    process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE,
  );
  let beats;
  try {
    beats = await fetchBeatsFromAirtable();
  } catch {
    const { STATIC_BEATS } = await import("@/lib/beats");
    beats = STATIC_BEATS;
  }

  return (
    <>
      <Hero />
      <PathSelector />
      <EarlyCapture />
      <Stats />
      <Marquee />
      <Collabs />
      <Listen />
      <BeatStore beats={beats} live={live} />
      <ExclusiveBanner />
      <Production />
      <Mastering />
      <Credits />
      <section id="contact" className="contact-section">
        <div className="wrap contact-inner">
          <ScrollReveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="section-eyebrow">Contact</div>
              <h2 className="section-title">Let&apos;s build your record.</h2>
              <p className="section-desc">
                Production quotes, exclusive rights, mastering — send a message
                and I&apos;ll respond within 24 hours.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <InquiryForm />
          </ScrollReveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
