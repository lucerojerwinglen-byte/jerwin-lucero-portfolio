import { site } from "@/content/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-4">
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
