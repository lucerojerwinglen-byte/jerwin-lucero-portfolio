"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Keyboard, Search, X } from "lucide-react";
import { TypingTest } from "@/components/web/TypingTest";
import { search, type SearchItem } from "@/lib/home/search";
import { hasSeenTour, markTourSeen, safeLocalStorage } from "@/lib/home/tour";
import { scrollBehavior } from "@/lib/home/motion";
import { OVERLAY_EVENT, type Overlay } from "./events";

/** Owns the Alt+K ask palette, the Alt+J typing test and the first-visit tour. */
export function Overlays({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState<Overlay | null>(null);
  const current = useRef<Overlay | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback((which: Overlay) => {
    // Remember where focus was only when nothing is open yet; re-opening from inside an
    // overlay would otherwise "return" focus to an element that is about to disappear.
    if (!current.current) opener.current = document.activeElement as HTMLElement | null;
    current.current = which;
    setOpen(which);
  }, []);

  const close = useCallback(() => {
    if (current.current === "tour") markTourSeen(safeLocalStorage());
    current.current = null;
    setOpen(null);
  }, []);

  // Give focus back only after the overlay has unmounted: its cleanup is what lifts `inert`
  // from the page, and the browser refuses to focus an inert element.
  useEffect(() => {
    if (open !== null || !opener.current) return;
    opener.current.focus?.();
    opener.current = null;
  }, [open]);

  useEffect(() => {
    const onEvent = (e: Event) => show((e as CustomEvent<Overlay>).detail);
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // Alt+K is the documented shortcut; Ctrl/⌘+K is the habit most people bring.
      if ((e.altKey && k === "k") || ((e.ctrlKey || e.metaKey) && k === "k")) {
        e.preventDefault();
        show("ask");
      } else if (e.altKey && k === "j") {
        e.preventDefault();
        show("typing");
      }
    };
    window.addEventListener(OVERLAY_EVENT, onEvent);
    window.addEventListener("keydown", onKey);
    // First visit: offer the tour once the page has settled.
    const t = hasSeenTour(safeLocalStorage()) ? undefined : window.setTimeout(() => show("tour"), 1200);
    return () => {
      window.removeEventListener(OVERLAY_EVENT, onEvent);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [show]);

  return (
    <>
      <AskPill hidden={open !== null} onAsk={() => show("ask")} />
      {open === "ask" && <Ask items={items} onClose={close} />}
      {open === "typing" && <Typing onClose={close} />}
      {open === "tour" && <Tour onClose={close} />}
    </>
  );
}

/** Ask pill (ADR 0007): makes the Ask palette findable without the menu or a keyboard. Not a chat. */
function AskPill({ hidden, onAsk }: { hidden: boolean; onAsk: () => void }) {
  return (
    <button type="button" className="ask-pill" hidden={hidden} onClick={onAsk} aria-label="Ask anything (Alt+K)">
      <Search className="ico" aria-hidden="true" />
      <span>Ask</span>
      <kbd>Alt</kbd>
      <kbd>K</kbd>
    </button>
  );
}

/** A real modal: the page behind is `inert` (no focus, no clicks, hidden from screen readers) until it closes. */
function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const behind = [...document.querySelectorAll<HTMLElement>(".topbar, .side, .main")];
    behind.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}

function Ask({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = search(items, query);
  const listId = "ask-results";

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    onClose();
    if (item.kind === "file") {
      window.location.href = item.href; // a file, not a page: let the browser open it
    } else if (item.href.startsWith("#")) {
      const target = document.querySelector(item.href);
      if (target instanceof HTMLDetailsElement) target.open = true; // a FAQ answer: show it
      target?.scrollIntoView({ behavior: scrollBehavior() });
      history.replaceState(null, "", item.href);
    } else router.push(item.href);
  };

  return (
    <Modal label="Ask anything" onClose={onClose}>
      <header>
        <Search className="ico" aria-hidden="true" />
        <input
          autoFocus
          value={query}
          placeholder="What do you want to find?"
          aria-label="Search the site"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[active] ? `ask-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
            e.preventDefault();
            if (!results.length) return;
            if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
            else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
            else go(results[active]);
          }}
        />
        <button type="button" className="close" onClick={onClose} aria-label="Close (Esc)" title="Close (Esc)">
          <X className="ico" aria-hidden="true" />
        </button>
      </header>
      {results.length ? (
        <ul className="results" id={listId} role="listbox">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.title}`}>
              <a
                id={`ask-${i}`}
                role="option"
                aria-selected={i === active}
                href={r.href}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(r);
                }}
              >
                <span>{r.title}</span>
                <span className="k">{r.kind}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Nothing matches “{query}”. Try “QA”, “Lovewin” or “résumé”.</p>
      )}
      <footer>
        <span>↑↓ to move</span>
        <span className="enter">
          <CornerDownLeft className="ico" aria-hidden="true" /> to open · esc to close
        </span>
      </footer>
    </Modal>
  );
}

function Typing({ onClose }: { onClose: () => void }) {
  return (
    <Modal label="Typing test" onClose={onClose}>
      <header>
        <Keyboard className="ico" aria-hidden="true" />
        <span style={{ flex: 1 }} className="mono">
          typing test
        </span>
        <button type="button" className="close" onClick={onClose} aria-label="Close (Esc)" title="Close (Esc)">
          <X className="ico" aria-hidden="true" />
        </button>
      </header>
      <div className="body">
        <TypingTest />
      </div>
    </Modal>
  );
}

const STEPS = [
  { target: "nav", title: "Find your way", text: "Pages and every section of this page live here." },
  { target: "keys", title: "Shortcuts", text: "Alt+K searches the whole site. Alt+J opens a typing test, if you want a break." },
  { target: "facts", title: "The short version", text: "Numbers here link to the work that backs them up." },
  { target: "projects", title: "What I’ve built", text: "Click a card behind to bring it forward." },
  { target: "resume", title: "Need a PDF?", text: "The full résumé is one click away, same as the download." },
];

/**
 * Not modal and never takes focus: it opens on its own after a delay, so grabbing focus
 * would yank keyboard users away from wherever they were. Esc and ←/→ work from anywhere.
 */
function Tour({ onClose }: { onClose: () => void }) {
  // Steps whose target is hidden (e.g. the sidebar on phones) are skipped.
  const [steps] = useState(() =>
    STEPS.filter((s) => document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`)?.getClientRects().length),
  );
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<DOMRect | null>(null);
  const step = steps[index];

  useLayoutEffect(() => {
    if (!step) return onClose();
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`)!;
    el.scrollIntoView({ block: "center", behavior: "instant" });
    const measure = () => setBox(el.getBoundingClientRect());
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [step, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((n) => Math.min(n + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((n) => Math.max(n - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, steps.length]);

  if (!step || !box) return null;
  const right = box.right + 16 + 300 < window.innerWidth;
  const pos = right
    ? { left: box.right + 16, top: Math.max(16, Math.min(box.top, window.innerHeight - 180)) }
    : { left: Math.max(16, Math.min(box.left, window.innerWidth - 316)), top: Math.min(box.bottom + 12, window.innerHeight - 180) };
  const last = index === steps.length - 1;

  return (
    <>
      <div className="tour-ring" style={{ left: box.left - 6, top: box.top - 6, width: box.width + 12, height: box.height + 12 }} />
      <div className="tour" role="dialog" aria-label="Site tour" aria-live="polite" style={pos}>
        <b>{step.title}</b>
        {step.text}
        <div className="nav">
          <span>
            {index + 1} / {steps.length}
          </span>
          <span style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}>
              Skip
            </button>
            <button type="button" onClick={() => (last ? onClose() : setIndex(index + 1))}>
              {last ? "Done" : "Next"}
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
