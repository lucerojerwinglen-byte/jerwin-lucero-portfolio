import { Section } from "@/components/Section";
import { skills } from "@/content/data/skills";

export function SkillsSection() {
  return (
    <Section id="skills" number="03" title="stack">
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 font-mono text-[12px] uppercase tracking-wide text-gray-500">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700"
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
