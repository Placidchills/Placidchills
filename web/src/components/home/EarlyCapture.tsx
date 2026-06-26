"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function EarlyCapture() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "free-beat", website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <section style={{ padding: "0 0 90px" }}>
      <div className="wrap">
        <ScrollReveal>
          <div className="early-capture-inner">
            <div className="early-capture-left">
              <div className="eyebrow-label">Free — yours immediately</div>
              <h3>Get a free beat before you scroll.</h3>
              <p>
                Drop your email and get a free production from the NIGHTWORK
                series instantly. First access to new drops, discounts and
                mastering openings before anyone else.
              </p>
            </div>
            <div className="early-capture-right">
              {status === "success" ? (
                <p className="early-capture-success" style={{ display: "block" }}>
                  ✓ On the list — check your inbox shortly.
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <label
                    htmlFor="early-capture-input"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="early-capture-input"
                    placeholder="your@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    style={error ? { borderColor: "#C75C4A" } : undefined}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ justifyContent: "center" }}
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Sending…" : "Send me the beat"}
                  </button>
                  {error && (
                    <p className="early-capture-note" style={{ color: "#C75C4A" }}>
                      {error}
                    </p>
                  )}
                  <p className="early-capture-note">
                    No spam. Unsubscribe whenever. One email, one free beat,
                    immediately.
                  </p>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
