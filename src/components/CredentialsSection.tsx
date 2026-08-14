import { Award, BookOpen } from "lucide-react";
import { Section } from "@/components/Section";
import { credentials } from "@/content/data/credentials";

export function CredentialsSection() {
  return (
    <Section
      id="credentials"
      eyebrow="Certifications & Seminars"
      title="Credentials & continuous learning"
    >
      <ul className="space-y-4">
        {credentials.map((c) => (
          <li
            key={c.title}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
          >
            {c.kind === "certification" ? (
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            ) : (
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            )}
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-muted">
                {c.issuer} · {c.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
