import { Section } from "@/components/Section";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";

export function ExperienceSection() {
  return (
    <Section id="experience" number="02" title="experience">
      <div className="mb-10 space-y-7">
        {experience.map((item) => (
          <div key={item.org} className="border-t border-gray-200 pt-5 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-medium text-ink">
                {item.role} · {item.org}
              </h3>
              <span className="font-mono text-[12px] text-gray-500">{item.period}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="mb-1 font-mono text-[12px] uppercase tracking-wide text-gray-500">
        Education
      </h3>
      <div>
        {education.map((item) => (
          <div
            key={item.school}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-gray-200 py-4 first:border-t-0"
          >
            <div>
              <p className="font-medium text-ink">{item.school}</p>
              <p className="text-sm text-gray-600">{item.detail}</p>
            </div>
            <span className="shrink-0 font-mono text-[12px] text-gray-500">{item.period}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
