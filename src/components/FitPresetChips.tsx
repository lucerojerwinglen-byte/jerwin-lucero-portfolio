"use client";

import { FIT_PRESET_EVENT } from "@/lib/fit/match";
import { presets } from "@/lib/fit/presets";

/** Preset chips on the overview tile: run that preset in the fit check below. */
export function FitPresetChips() {
  function run(id: string) {
    window.dispatchEvent(new CustomEvent(FIT_PRESET_EVENT, { detail: id }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("fit")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => run(p.id)}
          className="rounded-full border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-ink active:scale-[0.97]"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
