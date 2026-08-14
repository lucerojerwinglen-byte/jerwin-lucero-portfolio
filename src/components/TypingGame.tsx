"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Section } from "@/components/Section";
import { typingSnippets } from "@/content/data/typing-snippets";
import { cn } from "@/lib/utils";

const BEST_WPM_KEY = "typing-test-best-wpm";
const MASCOT_BOUNDS = { width: 90, height: 90 };
const MASCOT_STEP = 8;

function randomSnippet(exclude?: string) {
  const pool = typingSnippets.filter((s) => s !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? typingSnippets[0];
}

export function TypingGame() {
  // Deterministic on first render (server and client must match); randomized
  // after mount so every page load doesn't show the same snippet.
  const [target, setTarget] = useState(typingSnippets[0]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [mascotPos, setMascotPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(BEST_WPM_KEY);
    // One-time hydration of values that only exist client-side (localStorage,
    // and the randomized snippet — see comment on `target` above).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setBestWpm(Number(stored));
    setTarget(randomSnippet());
  }, []);

  const { wpm, accuracy } = useMemo(() => {
    const correct = [...typed].filter((ch, i) => ch === target[i]).length;
    // Recomputed on each keystroke (typed/target/startedAt deps), not a live
    // ticking clock, so reading Date.now() here is intentional.
    // eslint-disable-next-line react-hooks/purity
    const elapsed = startedAt ? (Date.now() - startedAt) / 60000 : 0;
    const safeElapsed = Math.max(elapsed, 1 / 60);
    return {
      wpm: startedAt ? Math.round(correct / 5 / safeElapsed) : 0,
      accuracy: typed.length ? Math.round((correct / typed.length) * 100) : 100,
    };
  }, [typed, target, startedAt]);

  function handleChange(value: string) {
    if (finished) return;
    if (!startedAt && value.length > 0) setStartedAt(Date.now());
    setTyped(value);
    if (value.length >= target.length) {
      setFinished(true);
      if (!bestWpm || wpm > bestWpm) {
        setBestWpm(wpm);
        localStorage.setItem(BEST_WPM_KEY, String(wpm));
      }
    }
  }

  function reset() {
    setTarget((prev) => randomSnippet(prev));
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    inputRef.current?.focus();
  }

  // Playful idle flourish: WASD nudges a little marker around before typing starts.
  function handleMascotKey(e: React.KeyboardEvent) {
    if (startedAt) return;
    const key = e.key.toLowerCase();
    setMascotPos((pos) => {
      const next = { ...pos };
      if (key === "w") next.y = Math.max(pos.y - MASCOT_STEP, -MASCOT_BOUNDS.height);
      if (key === "s") next.y = Math.min(pos.y + MASCOT_STEP, MASCOT_BOUNDS.height);
      if (key === "a") next.x = Math.max(pos.x - MASCOT_STEP, -MASCOT_BOUNDS.width);
      if (key === "d") next.x = Math.min(pos.x + MASCOT_STEP, MASCOT_BOUNDS.width);
      return next;
    });
  }

  return (
    <Section id="typing-test" eyebrow="Just for fun" title="Typing speed test">
      <p className="mb-4 text-sm text-muted">
        Nudge the dot with <kbd className="rounded border border-border px-1">W</kbd>{" "}
        <kbd className="rounded border border-border px-1">A</kbd>{" "}
        <kbd className="rounded border border-border px-1">S</kbd>{" "}
        <kbd className="rounded border border-border px-1">D</kbd> while you wait, then start typing.
      </p>

      <div className="relative mb-5 h-24 overflow-hidden rounded-xl border border-border bg-card">
        <div
          className="absolute h-3 w-3 rounded-full bg-accent transition-transform duration-100"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${mascotPos.x}px), calc(-50% + ${mascotPos.y}px))`,
          }}
        />
      </div>

      <p className="mb-4 rounded-xl border border-border bg-card p-4 font-mono text-sm leading-relaxed">
        {[...target].map((char, i) => {
          const typedChar = typed[i];
          const state =
            typedChar === undefined
              ? "pending"
              : typedChar === char
              ? "correct"
              : "incorrect";
          return (
            <span
              key={i}
              className={cn(
                state === "correct" && "text-emerald-500",
                state === "incorrect" && "bg-red-500/20 text-red-500",
                state === "pending" && "text-muted"
              )}
            >
              {char}
            </span>
          );
        })}
      </p>

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleMascotKey}
        disabled={finished}
        placeholder="Start typing here..."
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent disabled:opacity-60"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
        <span>
          WPM: <strong>{wpm}</strong>
        </span>
        <span>
          Accuracy: <strong>{accuracy}%</strong>
        </span>
        {bestWpm !== null && (
          <span className="text-muted">
            Personal best: <strong>{bestWpm}</strong> WPM
          </span>
        )}
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-card"
        >
          <RotateCcw className="h-3 w-3" />
          New snippet
        </button>
      </div>

      {finished && (
        <p className="mt-3 text-sm text-accent">
          Done — {wpm} WPM at {accuracy}% accuracy. Try another one?
        </p>
      )}
    </Section>
  );
}
