import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      meta="Last updated: June 2026 · Fair terms for digital goods"
      contentFile="refund-policy.html"
    />
  );
}
