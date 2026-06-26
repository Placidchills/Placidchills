"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr, pricing } from "@/config/site";

export function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const past = window.scrollY > window.innerHeight * 0.75;
      const footer = document.getElementById("contact");
      const atFoot =
        footer &&
        footer.getBoundingClientRect().top < window.innerHeight * 0.8;
      setVisible(past && !atFoot);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      id="sticky-bar"
      role="navigation"
      aria-label="Quick access"
      className={visible ? "visible" : ""}
    >
      <span className="sticky-brand">
        Placidchills — <span>3 services</span>
      </span>
      <div className="sticky-actions">
        <Link href="/#beats" className="sticky-btn sticky-btn-ghost">
          Beats from {formatInr(pricing.beats.mp3)}
        </Link>
        <Link href="/#mastering" className="sticky-btn sticky-btn-ghost">
          Mastering {formatInr(pricing.mastering.single)}
        </Link>
        <Link href="/#production" className="sticky-btn sticky-btn-primary">
          Commission Production →
        </Link>
      </div>
    </div>
  );
}
