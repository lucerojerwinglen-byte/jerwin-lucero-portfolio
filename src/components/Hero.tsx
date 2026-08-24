"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { site } from "@/content/data/site";

const MAX_TILT_DEG = 6;

export function Hero() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -MAX_TILT_DEG, y: px * MAX_TILT_DEG });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section id="about" className="relative scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="grid gap-9 sm:grid-cols-[13rem_1fr] sm:items-start sm:gap-10">
          <div className="reveal d1 mx-auto w-full max-w-[13rem] sm:mx-0">
            <div
              ref={tiltRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="[perspective:800px]"
            >
              <div
                className="relative transition-transform duration-200 ease-[var(--ease-in-out)] will-change-transform"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              >
                <Image
                  src="/images/jerwin-hero.png"
                  alt={site.name}
                  width={800}
                  height={1000}
                  priority
                  sizes="(min-width: 640px) 208px, 176px"
                  className="block aspect-[4/5] w-full select-none rounded-md border border-border object-cover object-top"
                  draggable={false}
                />
                <span className="absolute -bottom-2.5 left-3 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                  Rec. 001
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="reveal d1 font-mono text-[12px] uppercase tracking-wider text-gray-500">
              {site.title} · Sagility
            </p>
            <h1 className="reveal d2 mt-2 font-display text-3xl font-semibold leading-none sm:text-[2.4rem]">
              {site.name}
            </h1>
            <p className="reveal d2 mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-verified/30 bg-verified/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-verified">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Status: open to QA · Data · AI roles
            </p>

            <p className="reveal d3 mt-6 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {site.summary}
            </p>

            <div className="reveal d4 mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background transition-[opacity,transform] duration-150 ease-[var(--ease-out)] hover:opacity-80 active:scale-[0.97]"
              >
                <Mail className="h-4 w-4" />
                Hire me
              </a>
              <a
                href={site.resumePdfPath}
                download
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-ink"
              >
                <Download className="h-3.5 w-3.5" />
                Résumé
              </a>
            </div>

            <div className="reveal d5 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[12px] text-gray-500">
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
                email ↗
              </a>
              <span className="hidden text-gray-300 sm:inline">·</span>
              <span className="hidden sm:inline">
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
