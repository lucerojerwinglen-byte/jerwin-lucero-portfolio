import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { site } from "@/content/data/site";

export function Hero() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center sm:flex-row sm:text-left">
        <Image
          src="/images/jerwin-hero.jpg"
          alt={site.name}
          width={800}
          height={1000}
          priority
          sizes="(min-width: 640px) 224px, 176px"
          className="h-44 w-44 shrink-0 rounded-2xl border border-border object-cover object-top sm:h-56 sm:w-56"
        />
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            {site.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-xl text-muted">{site.summary}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <a
              href={site.resumePdfPath}
              download
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card"
            >
              <Mail className="h-4 w-4" />
              Hire Me
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Press <kbd className="rounded border border-border px-1.5 py-0.5">⌘K</kbd> to open the command menu
          </p>
        </div>
      </div>
    </section>
  );
}
