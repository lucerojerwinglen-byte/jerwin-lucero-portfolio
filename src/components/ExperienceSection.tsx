import { Section } from "@/components/Section";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";

export function ExperienceSection() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked & studied">
      <div className="mb-10 space-y-8">
        {experience.map((item) => (
          <div key={item.org}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-medium">
                {item.role} · {item.org}
              </h3>
              <span className="text-sm text-muted">{item.period}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
        Education
      </h3>
      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item.school}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <div>
              <p className="font-medium">{item.school}</p>
              <p className="text-sm text-muted">{item.detail}</p>
            </div>
            <span className="shrink-0 text-sm text-muted">{item.period}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
