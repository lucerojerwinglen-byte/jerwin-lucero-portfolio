"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CircleDashed, Circle, ClipboardCopy, ScanSearch, Send } from "lucide-react";
import { Section } from "@/components/Section";
import type { FitStatus } from "@/lib/fit/capabilities";
import {
  reconcile,
  formatReport,
  guessRole,
  FIT_REPORT_EVENT,
  FIT_PRESET_EVENT,
  type FitResult,
} from "@/lib/fit/match";
import { presets } from "@/lib/fit/presets";
import { cn } from "@/lib/utils";

const STAMP: Record<FitStatus, { text: string; icon: typeof Circle; className: string }> = {
  verified: {
    text: "Verified",
    icon: CheckCircle2,
    className: "border-verified/30 bg-verified/10 text-verified",
  },
  partial: {
    text: "Partial",
    icon: CircleDashed,
    className: "border-partial/30 bg-partial-soft text-partial",
  },
  gap: { text: "Not yet", icon: Circle, className: "border-border text-gray-500" },
};

function Stamp({ status, i }: { status: FitStatus; i: number }) {
  const s = STAMP[status];
  return (
    <span
      style={{ "--i": i } as React.CSSProperties}
      className={cn(
        "fit-stamp inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        s.className
      )}
    >
      <s.icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {s.text}
    </span>
  );
}

function Ledger({ result }: { result: FitResult }) {
  const { rows, counts, score } = result;
  const total = rows.length;
  const pct = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <p className="font-display text-4xl leading-none tabular-nums text-ink sm:text-5xl">
          {counts.verified}
          <span className="text-gray-400">/{total}</span>
        </p>
        <p className="font-mono text-[12px] uppercase tracking-wide text-gray-500">
          verified · {counts.partial} partial · {counts.gap} not yet ·{" "}
          <span className="text-ink">{score}% fit</span>
        </p>
      </div>

      <div
        className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
        aria-hidden="true"
      >
        <span className="fit-bar-seg bg-verified" style={{ width: pct(counts.verified) }} />
        <span
          className="fit-bar-seg bg-partial"
          style={{ width: pct(counts.partial), "--i": 1 } as React.CSSProperties}
        />
      </div>

      <ol className="mt-6 border-t border-border">
        {rows.map((row, i) => {
          const c = row.capability;
          return (
            <li
              key={c.id}
              style={{ "--i": i } as React.CSSProperties}
              className="fit-row grid grid-cols-[2.25rem_1fr] gap-x-2 border-b border-border py-3 sm:grid-cols-[2.5rem_1fr_auto] sm:gap-x-4"
            >
              <span className="pt-0.5 font-mono text-[11px] tabular-nums text-gray-400">
                R-{String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-ink">{c.label}</p>
                  <span className="shrink-0 sm:hidden">
                    <Stamp status={c.status} i={i} />
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-gray-400">
                  your post: “{row.matched}”
                </p>
                {c.note && <p className="mt-1.5 text-[13px] text-gray-600">{c.note}</p>}
                {c.evidence.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                    {c.evidence.map((e) => {
                      const external = e.href.startsWith("https://");
                      return (
                        <li key={e.label}>
                          <a
                            href={e.href}
                            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="text-gray-600 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink"
                          >
                            {e.label}
                            {external && " ↗"}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <span className="hidden pt-0.5 sm:block">
                <Stamp status={c.status} i={i} />
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function FitCheck() {
  const [text, setText] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [run, setRun] = useState<{ id: number; result: FitResult; role?: string } | null>(null);
  const [empty, setEmpty] = useState(false);
  const runCount = useRef(0);

  function reconcileNow(jobText: string, role?: string) {
    const result = reconcile(jobText);
    setEmpty(result.rows.length === 0);
    setRun(result.rows.length ? { id: ++runCount.current, result, role } : null);
  }

  function choosePreset(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setActivePreset(id);
    setText(preset.text);
    reconcileNow(preset.text, preset.role);
  }

  // The overview's preset chips ask for a preset from outside this section.
  const choosePresetRef = useRef(choosePreset);
  useEffect(() => {
    choosePresetRef.current = choosePreset;
  });
  useEffect(() => {
    const onPreset = (e: Event) => choosePresetRef.current((e as CustomEvent<string>).detail);
    window.addEventListener(FIT_PRESET_EVENT, onPreset);
    return () => window.removeEventListener(FIT_PRESET_EVENT, onPreset);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const preset = presets.find((p) => p.id === activePreset && p.text === text);
    reconcileNow(text, preset?.role ?? guessRole(text));
  }

  function sendReport() {
    if (!run) return;
    window.dispatchEvent(
      new CustomEvent(FIT_REPORT_EVENT, { detail: formatReport(run.result, run.role) })
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  async function copyReport() {
    if (!run) return;
    try {
      await navigator.clipboard.writeText(formatReport(run.result, run.role));
      toast.success("Fit report copied");
    } catch {
      toast.error("Couldn't copy. Your browser blocked clipboard access.");
    }
  }

  const summary = run
    ? `Reconciled ${run.result.rows.length} requirements: ${run.result.counts.verified} verified, ${run.result.counts.partial} partial, ${run.result.counts.gap} not yet.`
    : empty
      ? "No recognisable requirements found."
      : "";

  return (
    <Section id="fit" code="AUDIT" number="00" title="check my fit" emphasis="primary" tag="runs in your browser">
      <p className="max-w-xl text-[15px] leading-relaxed text-gray-600">
        Hiring for a role? Paste the job post. I&apos;ll reconcile every requirement against my
        record and link the evidence, gaps included.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[12px]">
        <span className="text-gray-500">No post handy? Try:</span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => choosePreset(p.id)}
            aria-pressed={activePreset === p.id}
            className={cn(
              "rounded-full border px-2.5 py-1 transition-colors duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
              activePreset === p.id
                ? "border-ink bg-ink text-background"
                : "border-border text-gray-600 hover:border-ink/40 hover:text-ink"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="fit-jd" className="sr-only">
          Job description
        </label>
        <textarea
          id="fit-jd"
          rows={run ? 3 : 6}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setEmpty(false);
          }}
          placeholder="Paste the job description here…"
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-[13px] leading-relaxed outline-none transition-colors duration-150 ease-[var(--ease-out)] focus:border-accent"
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
              run
                ? "border border-border text-ink hover:border-ink/40"
                : "btn-elevated bg-ink text-background"
            )}
          >
            <ScanSearch className="h-4 w-4" />
            {run ? "Re-run" : "Run the reconciliation"}
          </button>
          <span className="font-mono text-[11px] text-gray-400">
            Nothing leaves your browser unless you send it.
          </span>
        </div>
      </form>

      <p aria-live="polite" className="sr-only">
        {summary}
      </p>

      {empty && (
        <p role="status" className="mt-6 text-sm text-gray-600">
          I couldn&apos;t find a requirement I recognise in that text. Try a preset, or just{" "}
          <a href="#contact" className="text-ink underline underline-offset-2">
            ask me directly
          </a>
          .
        </p>
      )}

      {run && (
        <div key={run.id}>
          <Ledger result={run.result} />
          <p className="mt-4 text-[13px] text-gray-500">
            Only requirements I can recognise are listed. Anything else, ask me.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={sendReport}
              className="btn-elevated inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background active:scale-[0.97]"
            >
              <Send className="h-4 w-4" />
              Send this report to Jerwin
            </button>
            <button
              type="button"
              onClick={copyReport}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-ink"
            >
              <ClipboardCopy className="h-3.5 w-3.5" />
              Copy report
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
