"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <div className="wrap nav-inner">
        <Link href="/" className="nav-wordmark">
          <span className="dot" />
          Placidchills
        </Link>
        <div className="nav-links">
          <Link href="/#beats">Beats</Link>
          <Link href="/#production">Production</Link>
          <Link href="/#mastering">Mastering</Link>
          <Link href="/#credits">Credits</Link>
        </div>
        <Link href="/#contact" className="nav-cta">
          Request Quote
        </Link>
      </div>
    </nav>
  );
}
