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
            className="hover:text-ink"
          >
            github ↗
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-ink">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
