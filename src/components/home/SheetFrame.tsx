"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * Project sheet frame (ADR 0007): a modal over the current page, shown when a project link is
 * clicked inside the site (an intercepted route). Closing goes back in history, so Back, Esc,
 * the × and a click outside all do the same thing. Focus moves in, and returns to the link.
 */
export function SheetFrame({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const behind = [...document.querySelectorAll<HTMLElement>(".topbar, .side, .main, .ask-pill")];
    behind.forEach((el) => (el.inert = true));
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      behind.forEach((el) => (el.inert = false));
      // After inert is lifted, or the browser refuses to focus the link.
      requestAnimationFrame(() => opener?.isConnected && opener.focus());
    };
  }, [router]);

  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && router.back()}>
      <div
        ref={panel}
        className="sheet home"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
      >
        <header className="sheet-bar">
          <h2 id="sheet-title">{title}</h2>
          <button type="button" className="sheet-close" aria-label="Close" onClick={() => router.back()}>
            <X className="ico" aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
