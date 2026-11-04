import { Resume } from "@/components/doc/Resume";
import { Viewer } from "@/components/web/Viewer";
import { Outline } from "@/components/web/Outline";
import { WebSheet } from "@/components/web/WebSheet";

// The site is the résumé: two A4 sheets (also the PDF), then one web-only sheet.
export default function Home() {
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
