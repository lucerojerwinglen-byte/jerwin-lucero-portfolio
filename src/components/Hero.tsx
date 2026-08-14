import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { site } from "@/content/data/site";

export function Hero() {
  return (
    <section id="about" className="relative scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="grid gap-9 sm:grid-cols-[13rem_1fr] sm:items-start sm:gap-10">
          <div className="reveal d1 mx-auto w-full max-w-[13rem] sm:mx-0">
            <div className="relative">
              <Image
                src="/images/jerwin-hero.jpg"
                alt={site.name}
                width={800}
                height={1000}
                priority
                sizes="(min-width: 640px) 208px, 176px"
                className="block aspect-[4/5] w-full select-none rounded-2xl object-cover object-top"
                draggable={false}
              />
              <div
                aria-hidden="true"
                className="halftone-white mask-up pointer-events-none absolute inset-x-0 bottom-0 h-full rounded-2xl"
              />
            </div>
          </div>

          <div>
            <p className="reveal d1 font-mono text-[12px] uppercase tracking-wider text-gray-500">
              {site.title}
            </p>
            <h1 className="reveal d2 mt-2 font-pixel text-3xl leading-none sm:text-[2.4rem]">
              {site.name}
            </h1>

            <p className="reveal d3 mt-6 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {site.summary}
            </p>

            <div className="reveal d4 mt-7 flex flex-wrap items-center gap-3">
              <a
                href={site.resumePdfPath}
                download
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                <Download className="h-4 w-4" />
                Download resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                Hire me
              </a>
            </div>

            <div className="reveal d5 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[12px] text-gray-500">
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                github ↗
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-ink">
                email ↗
              </a>
              <span className="text-gray-300">·</span>
              <span>
                Press <kbd className="rounded border border-gray-200 px-1.5 py-0.5">⌘K</kbd> for
                the command menu
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
