"use client";

import { useEffect, useRef } from "react";
import { cptFlow } from "@/content/home/flow";
import { prefersReducedMotion } from "@/lib/home/motion";

// Geometry (SVG user units; the SVG scales to the column width).
const W = 600;
const ROW = 34;
const BOX = { w: 168, h: 26 };
const apps = [...cptFlow.apps, `+${cptFlow.moreApps} more apps`];
const H = apps.length * ROW + 24;
const mid = H / 2;
const hub = { x: 16, y: mid - 18, w: 112, h: 36 };
const store = { x: W - 128, y: mid - 18, w: 112, h: 36 };
const appX = W / 2 - BOX.w / 2;
const appY = (i: number) => 12 + i * ROW;

/** Curved link from (x1,y1) to (x2,y2). */
const link = (x1: number, y1: number, x2: number, y2: number) => {
  const c = (x2 - x1) / 2;
  return `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`;
};

/**
 * CPT Tools flow diagram (ADR 0007): one login → the apps → one database. Drawn with GSAP when the
 * sheet opens; GSAP is imported here only, and only when motion is allowed (it is a separate chunk).
 */
export function FlowDiagram() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let cancelled = false;
    let kill: (() => void) | undefined;
    (async () => {
      if (prefersReducedMotion()) return;
      const { gsap } = await import("gsap");
      if (cancelled || !svg.current) return;
      const q = gsap.utils.selector(svg.current);
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      svg.current.querySelectorAll<SVGPathElement>(".flow-link").forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });
      tl.from(q(".flow-hub"), { opacity: 0, x: -12, duration: 0.35 })
        .to(q(".flow-in"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.06 }, "-=0.1")
        .from(q(".flow-app"), { opacity: 0, x: -8, duration: 0.3, stagger: 0.06 }, "-=0.45")
        .to(q(".flow-out"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.06 }, "-=0.2")
        .from(q(".flow-store"), { opacity: 0, x: 12, duration: 0.35 }, "-=0.25");
      kill = () => tl.kill();
    })();
    return () => {
      cancelled = true;
      kill?.();
    };
  }, []);

  return (
    <figure className="flow">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        {apps.map((_, i) => (
          <g key={i}>
            <path className="flow-link flow-in" d={link(hub.x + hub.w, mid, appX, appY(i) + BOX.h / 2)} />
            <path className="flow-link flow-out" d={link(appX + BOX.w, appY(i) + BOX.h / 2, store.x, mid)} />
          </g>
        ))}
        <g className="flow-hub">
          <rect x={hub.x} y={hub.y} width={hub.w} height={hub.h} rx="8" className="flow-node solid" />
          <text x={hub.x + hub.w / 2} y={mid + 4} textAnchor="middle" className="flow-text on-ink">
            {cptFlow.hub}
          </text>
        </g>
        {apps.map((a, i) => (
          <g key={a} className="flow-app">
            <rect x={appX} y={appY(i)} width={BOX.w} height={BOX.h} rx="6" className={`flow-node${i === apps.length - 1 ? " dashed" : ""}`} />
            <text x={W / 2} y={appY(i) + BOX.h / 2 + 4} textAnchor="middle" className="flow-text">
              {a}
            </text>
          </g>
        ))}
        <g className="flow-store">
          <rect x={store.x} y={store.y} width={store.w} height={store.h} rx="8" className="flow-node solid" />
          <text x={store.x + store.w / 2} y={mid + 4} textAnchor="middle" className="flow-text on-ink">
            {cptFlow.store}
          </text>
        </g>
      </svg>
      <figcaption>
        {cptFlow.hub} opens eight connected apps ({cptFlow.apps.join(", ").toLowerCase()} and {cptFlow.moreApps} more),
        and they all share {cptFlow.store.toLowerCase()}. Built with {cptFlow.tech.join(", ")}.
      </figcaption>
    </figure>
  );
}
