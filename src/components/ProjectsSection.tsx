import { Section } from "@/components/Section";
import { projects } from "@/content/data/projects";
import type { Project } from "@/types/content";

function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-ink">{project.title}</h3>
        <span className="shrink-0 font-mono text-[12px] text-gray-500 group-hover:text-ink">
          {project.repoUrl ? "code ↗" : "academic"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-gray-500">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </>
  );

  if (project.repoUrl) {
    return (
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noreferrer"
        className="group -mx-3 block rounded-lg border-t border-gray-200 px-3 py-5 first:border-t-0 first:pt-4 hover:bg-gray-50"
      >
        {body}
      </a>
    );
  }

  return (
    <div className="-mx-3 border-t border-gray-200 px-3 py-5 first:border-t-0 first:pt-4">
      {body}
    </div>
  );
}

export function ProjectsSection() {
  const engineering = projects.filter((p) => p.category === "engineering");
  const academic = projects.filter((p) => p.category === "academic");

  return (
    <Section id="projects" number="01" title="projects">
      <div className="mb-8">
        <h3 className="mb-1 font-mono text-[12px] uppercase tracking-wide text-gray-500">
          Shipped &amp; open source
        </h3>
        <div>
          {engineering.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-1 font-mono text-[12px] uppercase tracking-wide text-gray-500">
          Academic &amp; research
        </h3>
        <div>
          {academic.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </Section>
  );
}
