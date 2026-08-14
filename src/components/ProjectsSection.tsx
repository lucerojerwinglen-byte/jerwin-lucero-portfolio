import { ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";
import { projects } from "@/content/data/projects";
import type { Project } from "@/types/content";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">{project.title}</h3>
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs text-accent hover:underline"
          >
            View Code <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted">
            Academic project
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background px-2.5 py-1 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const engineering = projects.filter((p) => p.category === "engineering");
  const academic = projects.filter((p) => p.category === "academic");

  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built">
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          Shipped &amp; open source
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {engineering.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          Academic &amp; research
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {academic.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </Section>
  );
}
