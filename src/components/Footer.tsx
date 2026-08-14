import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { site } from "@/content/data/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 font-mono text-[12px] text-gray-500 sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-4">
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            github ↗
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <Mail className="h-3.5 w-3.5" />
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
