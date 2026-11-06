"use client";

import { useEffect, useRef, useState } from "react";
import { applyDisplay, loadDisplay, saveDisplay, type Display } from "@/lib/home/display";
import { safeLocalStorage } from "@/lib/home/tour";

const options: [keyof Display, string][] = [
  ["largerText", "Larger text"],
  ["reduceMotion", "Reduce motion"],
  ["readableFont", "Readable font"],
];

/** Accessibility panel (ADR 0007): the `Aa` button beside the theme switch. */
export function DisplayPanel() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState<Display | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Settings live in the browser only; read them after mount (the boot script already applied them).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDisplay(loadDisplay(safeLocalStorage())), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation(); // close the panel, not the phone menu behind it
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const toggle = (key: keyof Display) => {
    if (!display) return;
    const next = { ...display, [key]: !display[key] };
    setDisplay(next);
    applyDisplay(document.documentElement, next);
    saveDisplay(safeLocalStorage(), next);
  };

  return (
    <div className="display" ref={wrap}>
      <button
        ref={button}
        type="button"
        aria-label="Accessibility"
        title="Accessibility"
        aria-expanded={open}
        aria-controls="display-pop"
        onClick={() => setOpen((v) => !v)}
      >
        Aa
      </button>
      {open && (
        <div className="display-pop" id="display-pop" role="group" aria-label="Accessibility">
          {options.map(([key, label]) => (
            <button key={key} type="button" role="switch" aria-checked={display?.[key] ?? false} onClick={() => toggle(key)}>
              {label}
              <span className="track" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
