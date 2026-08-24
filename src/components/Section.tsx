"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  number,
  className,
  children,
  emphasis = "default",
  tag,
}: {
  id: string;
  title: string;
  number: string;
  className?: string;
  children: React.ReactNode;
  emphasis?: "default" | "primary";
  tag?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={cn("scroll-mt-24 py-10 sm:py-12", className)}
    >
      <div className="mx-auto max-w-2xl px-6">
        <div
          className={cn(
            "reveal-scroll flex items-center gap-2 border-b pb-2",
            emphasis === "primary" ? "border-ink/20" : "border-border",
            inView && "in-view"
          )}
        >
          <span className="font-mono text-[11px] tabular-nums text-muted">REC-{number}</span>
          <h2
            className={cn(
              "font-display uppercase tracking-[0.06em]",
              emphasis === "primary" ? "text-base font-semibold text-ink" : "text-sm text-gray-500"
            )}
          >
            {title}
          </h2>
          {emphasis === "primary" && (
            <CheckCircle2 className="h-3.5 w-3.5 text-verified" aria-hidden="true" />
          )}
          {tag && (
            <span className="ml-auto rounded-full border border-gray-200 px-1.5 py-0.5 font-mono text-[9px] font-normal uppercase tracking-wide text-gray-400">
              {tag}
            </span>
          )}
        </div>
        <div className={cn("reveal-scroll d1 mt-6", inView && "in-view")}>{children}</div>
      </div>
    </section>
  );
}
