import { numberSections, sections, type SectionId } from "@/content/home/home";
import { searchItems } from "@/lib/home/search-items";
import { Sidebar } from "@/components/home/Sidebar";
import { Overlays } from "@/components/home/Overlays";
import {
  Affiliations,
  Blog,
  Certifications,
  Contact,
  Experience,
  Facts,
  Footer,
  GitHub,
  Hero,
  NumberedSection,
  Projects,
  Recommendations,
} from "@/components/home/Sections";

// Homepage (ADR 0005): sidebar + one column of numbered sections. The résumé is at /resume.
export const revalidate = 86400; // the GitHub graph refreshes daily

// Keyed by SectionId: adding a section to home.ts without a body here fails the typecheck.
const sectionBodies: Record<SectionId, () => React.ReactNode> = {
  blog: Blog,
  projects: Projects,
  experience: Experience,
  certifications: Certifications,
  recommendations: Recommendations,
  affiliations: Affiliations,
  github: GitHub,
};

export default function Home() {
  return (
    <div className="home">
      <Sidebar />
      <main className="main" id="top">
        <span className="dots" aria-hidden="true" style={{ top: 0, right: 0, width: 420, height: 320 }} />
        <span className="dots" aria-hidden="true" style={{ top: 1100, left: -120, width: 300, height: 300 }} />
        <div className="col">
          <Hero />
          <Facts />
          {numberSections(sections).map((s) => {
            const Body = sectionBodies[s.id];
            return (
              <NumberedSection key={s.id} s={s}>
                <Body />
              </NumberedSection>
            );
          })}
          <Contact />
          <Footer />
        </div>
      </main>
      <Overlays items={searchItems()} />
    </div>
  );
}
