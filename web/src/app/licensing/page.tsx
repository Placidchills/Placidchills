import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Licensing",
};

export default function LicensingPage() {
  return (
    <LegalPage
      eyebrow="Beats"
      title="Licensing"
      meta="Understand exactly what you're buying before you buy it"
      contentFile="licensing.html"
    />
  );
}
