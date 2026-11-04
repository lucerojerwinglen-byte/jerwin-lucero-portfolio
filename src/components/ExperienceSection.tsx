import { Building2, GraduationCap, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/Section";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";

export function ExperienceSection() {
  return (
    <>
      <section aria-hidden="true" data-sc-act="pin" data-sc-span="3.2">
        <div data-sc-stage className="flex items-center justify-center">
          <div className="mx-auto w-full max-w-2xl px-6 text-center">
            <p
              data-sc-cue="0 1 0 0.3"
              className="font-mono text-[11px] uppercase tracking-wide text-gray-600"
            >
              REC-02 · reconciliation
            </p>

            <div className="relative mt-8">
              <p
                data-sc-cue="0 0.55 0.22 0.2"
                className="relative inline-block font-display text-xl leading-tight sm:text-2xl"
              >
                Filed as: HR Transactions Analyst — Workday
                <span
                  data-sc-reveal="right"
                  data-sc-reveal-at="0.28 0.5"
                  className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink"
                  aria-hidden="true"
                />
              </p>
            </div>

            <p
              data-sc-cue="0.5 1 0.25 0.2"
              className="mt-6 font-display text-2xl leading-tight text-verified sm:text-3xl"
            >
              Reclassified as: QA · Data · AI — building toward it
            </p>

            <div
              data-sc-reveal="iris"
              data-sc-reveal-at="0.58 0.8"
              className="mx-auto mt-9 flex h-20 w-20 items-center justify-center rounded-full border-2 border-verified text-verified"
            >
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <Section
        id="experience"
        number="02"
        title="experience"
        emphasis="primary"
        className="pt-3 sm:pt-4"
      >
        <div className="mb-10 space-y-7" data-sc-in data-sc-stagger="60">
          {experience.map((item) => (
            <div key={item.org} className="border-t border-gray-200 pt-5 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-2 font-medium text-ink">
                  <Building2 className="h-4 w-4 shrink-0 text-gray-500" />
                  {item.role} · {item.org}
                </h3>
                <span className="font-mono text-[12px] text-gray-500">
                  {item.period}
                  {item.location && ` · ${item.location}`}
                </span>
              </div>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
          <GraduationCap className="h-3.5 w-3.5" />
          Education
        </h3>
        <div data-sc-in data-sc-stagger="50">
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
    </>
  );
}
