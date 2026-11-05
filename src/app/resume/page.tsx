import type { Metadata } from "next";
import { Resume } from "@/components/doc/Resume";
import { Viewer } from "@/components/web/Viewer";
import { Outline } from "@/components/web/Outline";
import { WebSheet } from "@/components/web/WebSheet";
import { site } from "@/content/data/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${site.shortName}'s résumé: two A4 pages, the same as the downloadable PDF.`,
};

// The résumé (ADR 0004, moved here by ADR 0005): two A4 sheets (also the PDF), then one web-only sheet.
export default function ResumePage() {
  return (
    <>
      <Viewer />
      <Outline />
      <main id="doc" className="doc" tabIndex={-1}>
        <Resume />
        <WebSheet />
      </main>
    </>
  );
}
