import Link from "next/link";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-bio">
            <p>
              I&apos;m <span className="name">{site.owner}</span> —{" "}
              {site.name}. Independent music producer and mastering engineer
              with {site.experienceYears} years in Hip-Hop, Trap and Drill.
              Production credits across some of the most-streamed DHH records in
              the country. If you&apos;re building a record and need it to hit,
              reach out.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Listen</h4>
              <a href={site.social.spotify} target="_blank" rel="noopener">
                Spotify
              </a>
              <a href={site.social.youtube} target="_blank" rel="noopener">
                YouTube
              </a>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href={site.social.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
              <Link href="/#production">Production</Link>
              <Link href="/#mastering">Mastering</Link>
              <Link href="/#beats">Beats</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Link href="/licensing">Licensing</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/refund-policy">Refunds</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LegalFooter() {
  return (
    <footer className="legal-footer">
      <div className="footer-links">
        <Link href="/disclaimer">Disclaimer</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/refund-policy">Refund Policy</Link>
        <Link href="/terms-of-service">Terms of Service</Link>
        <Link href="/licensing">Licensing</Link>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
