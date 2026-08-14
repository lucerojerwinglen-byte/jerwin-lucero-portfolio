"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  number,
  className,
  children,
}: {
  id: string;
  title: string;
  number: string;
  className?: string;
  children: React.ReactNode;
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
        <h2
          className={cn("reveal-scroll font-pixel text-sm text-gray-500", inView && "in-view")}
        >
          {number} — {title}
        </h2>
        <div className={cn("reveal-scroll d1 mt-6", inView && "in-view")}>{children}</div>
      </div>
    </section>
  );
}
