"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { typingSnippets } from "@/content/data/typing-snippets";

const BEST_WPM_KEY = "typing-test-best-wpm";

function randomSnippet(exclude?: string) {
  const pool = typingSnippets.filter((s) => s !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? typingSnippets[0];
}

/** Appendix A: a typing speed test. Web only, never printed. */
export function TypingTest() {
  // Same snippet on server and first client render; randomized after mount.
  const [target, setTarget] = useState(typingSnippets[0]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // One-time hydration of client-only values (saved best, random snippet).
    try {
      const stored = localStorage.getItem(BEST_WPM_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setBest(Number(stored));
    } catch {}
    setTarget(randomSnippet());
  }, []);

  const { wpm, accuracy } = useMemo(() => {
    const correct = [...typed].filter((ch, i) => ch === target[i]).length;
    // Recomputed per keystroke, not on a ticking clock, so reading the time here is intended.
    // eslint-disable-next-line react-hooks/purity
    const end = finishedAt ?? Date.now();
    const minutes = startedAt ? Math.max((end - startedAt) / 60000, 1 / 60) : 0;
    return {
      wpm: startedAt ? Math.round(correct / 5 / minutes) : 0,
      accuracy: typed.length ? Math.round((correct / typed.length) * 100) : 100,
    };
  }, [typed, target, startedAt, finishedAt]);

  const finished = finishedAt !== null;

  useEffect(() => {
    if (!finished) return;
    if (best === null || wpm > best) {
      // Saving a new personal best once the run ends.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBest(wpm);
      try {
        localStorage.setItem(BEST_WPM_KEY, String(wpm));
      } catch {}
    }
    // Only when a run finishes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function onType(value: string) {
    if (finished) return;
    const now = Date.now();
    if (!startedAt && value.length) setStartedAt(now);
    setTyped(value.slice(0, target.length));
    if (value.length >= target.length) setFinishedAt(now);
  }

  function again() {
    setTarget((prev) => randomSnippet(prev));
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    input.current?.focus();
  }

  return (
    <div data-nofind>
      <div className="typing" onClick={() => input.current?.focus()}>
        <span aria-hidden="true">
          {[...target].map((ch, i) => {
            const t = typed[i];
            const cls = t === undefined ? (i === typed.length ? "cur" : "") : t === ch ? "ok" : "bad";
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </span>
        <input
          ref={input}
          value={typed}
          onChange={(e) => onType(e.target.value)}
          aria-label={`Type this sentence: ${target}`}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={finished}
        />
      </div>
      <div className="typing-stats" aria-live="polite">
        <span>
          WPM <b>{wpm}</b>
        </span>
        <span>
          Accuracy <b>{accuracy}%</b>
        </span>
        {best !== null && (
          <span>
            Best <b>{best}</b>
          </span>
        )}
        <button type="button" className="btn" onClick={again}>
          <RotateCcw className="ico" aria-hidden="true" />
          New sentence
        </button>
      </div>
      {finished ? (
        <p className="done">
          {wpm} words a minute at {accuracy}% accuracy. Another?
        </p>
      ) : (
        !startedAt && <p className="tags" style={{ marginTop: 6 }}>Click the box and start typing; the clock starts on your first key.</p>
      )}
    </div>
  );
}
