import { Code2, Bug, BrainCircuit, Wrench, Users, type LucideIcon } from "lucide-react";
import { Section } from "@/components/Section";
import { skills } from "@/content/data/skills";

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Code2,
  "Testing & QA": Bug,
  "AI / ML": BrainCircuit,
  "Tools & Platforms": Wrench,
  General: Users,
};

export function SkillsSection() {
  return (
    <Section id="skills" number="03" title="stack">
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => {
          const Icon = categoryIcons[group.category] ?? Code2;
          return (
            <div key={group.category}>
              <h3 className="mb-3 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
                <Icon className="h-3.5 w-3.5" />
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
          );
        })}
      </div>
    </Section>
  );
}
