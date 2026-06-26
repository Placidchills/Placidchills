import Link from "next/link";
import { LegalFooter } from "@/components/layout/Footer";
import fs from "fs";
import path from "path";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  meta: string;
  contentFile: string;
};

export function LegalPage({ eyebrow, title, meta, contentFile }: LegalPageProps) {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content", contentFile),
    "utf8",
  );

  return (
    <>
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-wordmark">
            <span className="dot" />
            Placidchills
          </Link>
          <Link href="/" className="nav-back">
            ← Back to site
          </Link>
        </div>
      </nav>
      <main>
        <div className="wrap">
          <div className="page-eyebrow">{eyebrow}</div>
          <h1 className="page-title">{title}</h1>
          <div className="page-meta">{meta}</div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </main>
      <LegalFooter />
    </>
  );
}
