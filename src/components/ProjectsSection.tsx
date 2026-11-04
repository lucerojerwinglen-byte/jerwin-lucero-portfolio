"use client";

import { useState } from "react";
import { GraduationCap, Rocket, FlaskConical, X, Globe, Lock } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Section } from "@/components/Section";
import { projects } from "@/content/data/projects";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  activeTag,
  onTagClick,
}: {
  project: Project;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}) {
  return (
    <div className="-mx-3 rounded-lg border-t border-gray-200 px-3 py-5 transition-colors duration-300 first:border-t-0 first:pt-4 hover:bg-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-ink">{project.title}</h3>
        <div className="flex shrink-0 items-center gap-3 font-mono text-[12px] text-gray-500">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-ink hover:opacity-70"
            >
              <Globe className="h-3.5 w-3.5" />
              live ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              code ↗
            </a>
          )}
          {project.internal && (
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              internal
            </span>
          )}
          {project.category === "academic" && !project.repoUrl && (
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              academic
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-x-1 gap-y-1.5 font-mono text-[12px]">
        {project.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagClick(tag)}
            aria-pressed={activeTag === tag}
            className={cn(
              "rounded px-1.5 py-0.5 transition-colors",
              activeTag === tag ? "bg-ink text-background" : "text-gray-500 hover:text-ink"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  function handleTagClick(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }

  const matches = (p: Project) => !activeTag || p.tags.includes(activeTag);
  const engineering = projects.filter((p) => p.category === "engineering" && matches(p));
  const academic = projects.filter((p) => p.category === "academic" && matches(p));

  return (
    <Section
      id="projects"
      number="01"
      title="projects"
      emphasis="primary"
      className="pt-3 sm:pt-4"
    >
      {activeTag && (
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className="mb-6 inline-flex scale-100 items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-background opacity-100 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0"
        >
          filtered by {activeTag}
          <X className="h-3 w-3" />
        </button>
      )}

      <div key={activeTag ?? "all"} className="reveal">
        {engineering.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
              <Rocket className="h-3.5 w-3.5" />
              Shipped &amp; in use
            </h3>
            <div data-sc-in data-sc-stagger="50">
              {engineering.map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  activeTag={activeTag}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          </div>
        )}

        {academic.length > 0 && (
          <div>
            <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
              <FlaskConical className="h-3.5 w-3.5" />
              Academic &amp; research
            </h3>
            <div data-sc-in data-sc-stagger="50">
              {academic.map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  activeTag={activeTag}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
