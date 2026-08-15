"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Download, Mail } from "lucide-react";
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
                className="relative transition-transform duration-200 ease-[var(--ease-out)] will-change-transform"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              >
                <Image
                  src="/images/jerwin-hero.png"
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
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background transition-[opacity,transform] duration-150 ease-[var(--ease-out)] hover:opacity-80 active:scale-[0.97]"
              >
                <Download className="h-4 w-4" />
                Download resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-ink transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-gray-50 active:scale-[0.97]"
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
