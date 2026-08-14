import { Section } from "@/components/Section";
import { skills } from "@/content/data/skills";

export function SkillsSection() {
  return (
    <Section id="skills" eyebrow="Stack" title="Skills & tools">
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
