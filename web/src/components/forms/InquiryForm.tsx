"use client";

import { useState } from "react";

const services = [
  "Custom Production",
  "Exclusive Beat Rights",
  "Beat Lease",
  "Mastering",
  "Other",
];

export function InquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "Custom Production",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", service: "Custom Production", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="inquiry-success glass" style={{ padding: 32, borderRadius: 14 }}>
        <p style={{ color: "var(--accent)", fontFamily: "Space Mono, monospace" }}>
          ✓ Message sent — I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="inquiry-form">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div className="inquiry-grid">
        <label>
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
          />
        </label>
      </div>
      <label>
        <span>Service</span>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me about your project, references, timeline…"
        />
      </label>
      {error && <p className="inquiry-error">{error}</p>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "loading" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
