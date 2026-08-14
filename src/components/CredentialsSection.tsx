import { Award, BookOpen } from "lucide-react";
import { Section } from "@/components/Section";
import { credentials } from "@/content/data/credentials";

export function CredentialsSection() {
  return (
    <Section id="credentials" number="04" title="certifications">
      <ul>
        {credentials.map((c) => (
          <li
            key={c.title}
            className="flex items-start gap-3 border-t border-gray-200 py-4 first:border-t-0 first:pt-0"
          >
            {c.kind === "certification" ? (
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            ) : (
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            )}
            <div>
              <p className="font-medium text-ink">{c.title}</p>
              <p className="font-mono text-[12px] text-gray-500">
                {c.issuer} · {c.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
