"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface StackTag {
  key: string;
  /** Logo + name, rendered on the server (logo data never reaches the browser bundle). */
  node: React.ReactNode;
  usedIn: { label: string; href: string }[];
}
export interface StackGroup {
  label: string;
  tags: StackTag[];
}

/**
 * The homepage stack: filter buttons with a sliding highlight, tags that ease in when the filter
 * changes, and a "used in" card on hover (mouse), focus (keyboard) or tap (touch) that links to
 * the projects and jobs where the skill was actually used.
 */
export function StackExplorer({ groups, moreHref }: { groups: StackGroup[]; moreHref: string }) {
  const all: StackGroup = { label: "All", tags: groups.flatMap((g) => g.tags) };
  const filters = [all, ...groups];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [alignRight, setAlignRight] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [glide, setGlide] = useState<{ left: number; width: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // The highlight slides under the active filter.
  useLayoutEffect(() => {
    const btn = barRef.current?.querySelectorAll<HTMLButtonElement>("button")[active];
    if (btn) setGlide({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active]);

  // Close the card on Escape or a tap/click elsewhere.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const show = (key: string, el: HTMLElement) => {
    const box = boxRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setAlignRight(!!box && r.left - box.left > box.width / 2);
    setOpen(key);
  };

  const tags = filters[active].tags;

  return (
    <div className="stackx" ref={boxRef}>
      <div className="stackx-filters" role="group" aria-label="Filter the stack" ref={barRef}>
        {glide && <span className="stackx-glide" style={{ left: glide.left, width: glide.width }} aria-hidden="true" />}
        {filters.map((f, i) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={i === active}
            onClick={() => {
              setActive(i);
              setOpen(null);
            }}
          >
            {f.label}
            <span className="stackx-count">{f.tags.length}</span>
          </button>
        ))}
      </div>

      {/* key = filter: the list remounts so its tags ease in one after another. */}
      <div className="htags stackx-tags" key={filters[active].label}>
        {tags.map((t, i) => {
          const style = { "--i": i } as React.CSSProperties;
          if (!t.usedIn.length) {
            return (
              <span key={t.key} className="htag stackx-tag" style={style}>
                {t.node}
              </span>
            );
          }
          const id = `used-${t.key.replace(/[^a-z0-9]/gi, "-")}`;
          const isOpen = open === t.key;
          return (
            <span
              key={t.key}
              className="stackx-wrap"
              style={style}
              onMouseEnter={(e) => window.matchMedia("(hover: hover)").matches && show(t.key, e.currentTarget)}
              onMouseLeave={() => window.matchMedia("(hover: hover)").matches && setOpen(null)}
            >
              <button
                type="button"
                className="htag stackx-tag has-used"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={(e) => (isOpen ? setOpen(null) : show(t.key, e.currentTarget))}
              >
                {t.node}
              </button>
              <span id={id} className="stackx-used" data-open={isOpen} data-right={alignRight || undefined} hidden={!isOpen}>
                <span className="caps">used in</span>
                {t.usedIn.map((u) => (
                  <Link key={u.href} href={u.href} onClick={() => setOpen(null)}>
                    {u.label} ↗
                  </Link>
                ))}
              </span>
            </span>
          );
        })}
        <Link className="htag more stackx-tag" style={{ "--i": tags.length } as React.CSSProperties} href={moreHref}>
          + more
        </Link>
      </div>
    </div>
  );
}
