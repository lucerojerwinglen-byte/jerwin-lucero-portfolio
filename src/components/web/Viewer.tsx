"use client";

// Everything web-only that sits around the paper: the viewer bar, find-in-document,
// the live page counter, the skill-evidence trace, copy actions and keyboard shortcuts.
// The document itself stays server-rendered; this component only listens and
// decorates (classes, CSS highlights), it never rewrites the document's text.
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Moon,
  PenLine,
  Printer,
  Search,
  Sun,
  X,
} from "lucide-react";
import { site } from "@/content/data/site";
import { usePresence } from "./usePresence";

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

async function copy(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error("Couldn’t copy. Your browser blocked the clipboard.");
  }
}

/** Document entries (projects, jobs) a skill points at, in page order, without repeats. */
const uniqueEntries = (ids: string[]) => [
  ...new Set(ids.flatMap((id) => [...document.querySelectorAll<HTMLElement>(`[data-entry~="${CSS.escape(id)}"]`)])),
].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

function readNotesPref(): boolean {
  try {
    return localStorage.getItem("margin-notes") !== "off";
  } catch {
    return true;
  }
}

export function Viewer() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState("1");
  const [notes, setNotes] = useState(true);
  const [findOpen, setFindOpen] = useState(false);
  const [trace, setTrace] = useState<{ skill: string; ids: string[]; at: number; count: number } | null>(null);
  const readers = usePresence();

  useEffect(() => {
    // Client-only values (theme icon, saved notes preference) after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setNotes(readNotesPref());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.notes = notes ? "on" : "off";
    try {
      localStorage.setItem("margin-notes", notes ? "on" : "off");
    } catch {}
  }, [notes]);

  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    [resolvedTheme, setTheme],
  );

  // Live page counter: whichever sheet crosses the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setPage((e.target as HTMLElement).dataset.page ?? "1")),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll(".sheet[data-page]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // ── Skill evidence trace ──
  const clearTrace = useCallback(() => {
    const doc = document.getElementById("doc");
    if (doc) delete doc.dataset.tracing;
    document.querySelectorAll(".traced").forEach((el) => el.classList.remove("traced"));
    document.querySelectorAll('.sk[aria-pressed="true"]').forEach((el) => el.setAttribute("aria-pressed", "false"));
    setTrace(null);
  }, []);

  const goToEntry = useCallback((ids: string[], at: number) => {
    const list = uniqueEntries(ids);
    list[at]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const startTrace = useCallback(
    (button: HTMLElement) => {
      const skill = button.textContent ?? "";
      if (button.getAttribute("aria-pressed") === "true") return clearTrace();
      clearTrace();
      const ids = (button.dataset.ev ?? "").split(" ").filter(Boolean);
      const list = uniqueEntries(ids);
      if (!list.length) return;
      list.forEach((el) => el.classList.add("traced"));
      document.getElementById("doc")!.dataset.tracing = "";
      button.setAttribute("aria-pressed", "true");
      setTrace({ skill, ids, at: 0, count: list.length });
      goToEntry(ids, 0);
    },
    [clearTrace, goToEntry],
  );

  // Delegated clicks: the document is server-rendered, so its buttons carry data-* hooks.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      const copyBtn = t.closest<HTMLElement>("[data-copy]");
      if (copyBtn) return void copy(copyBtn.dataset.copy!, copyBtn.dataset.copyLabel ?? "Copied");
      const anchor = t.closest<HTMLAnchorElement>("a.anchor");
      if (anchor) {
        e.preventDefault();
        const hash = anchor.getAttribute("href")!;
        history.replaceState(null, "", hash);
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
        return void copy(location.href, "Link to this section copied");
      }
      const skill = t.closest<HTMLElement>(".sk[data-ev]");
      if (skill) startTrace(skill);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [startTrace]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setFindOpen(true);
        return;
      }
      if (e.key === "Escape" && trace) return clearTrace();
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        setFindOpen(true);
      } else if (e.key === "t") toggleTheme();
      else if (e.key === "n") setNotes((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTheme, trace, clearTrace]);

  const pageLabel = page === "A" ? "Appendix · web only" : null;

  return (
    <>
      <a className="skip" href="#doc">
        Skip to the résumé
      </a>
      <header className="bar">
        <div className="file">
          <FileText className="ico" aria-hidden="true" />
          {site.resumePdfName}
        </div>
        <div className="pager" aria-live="polite">
          {pageLabel ?? (
            <>
              Page <b>{page}</b> <span>/ 2</span>
            </>
          )}
        </div>
        {readers !== null && (
          <div className="readers hide-sm" title="People reading this right now">
            <i aria-hidden="true" />
            {readers} reading
          </div>
        )}
        <span className="sep" />
        <button type="button" className="btn" onClick={() => setFindOpen(true)} aria-label="Find in document (Ctrl K)">
          <Search className="ico" aria-hidden="true" />
          <span className="hide-sm">Find</span>
          <kbd className="hide-sm">Ctrl K</kbd>
        </button>
        <button
          type="button"
          className="btn notes-btn"
          aria-pressed={notes}
          onClick={() => setNotes((v) => !v)}
          data-tip={notes ? "Hide margin notes (N)" : "Show margin notes (N)"}
        >
          <PenLine className="ico" aria-hidden="true" />
          Notes
        </button>
        <button
          type="button"
          className="btn"
          onClick={toggleTheme}
          aria-label="Toggle reading lamp (dark mode)"
          data-tip="Reading lamp (T)"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="ico" aria-hidden="true" />
          ) : (
            <Moon className="ico" aria-hidden="true" />
          )}
        </button>
        <button type="button" className="btn hide-sm" onClick={() => window.print()} data-tip="Same two pages as the PDF">
          <Printer className="ico" aria-hidden="true" />
          Print
        </button>
        <a className="btn primary" href={site.resumePdfPath} download={site.resumePdfName}>
          <Download className="ico" aria-hidden="true" />
          PDF
        </a>
      </header>

      {findOpen && <FindBar onClose={() => setFindOpen(false)} />}

      {trace && (
        <div className="trace" role="status">
          <span>
            Where I used <b>{trace.skill}</b> · {trace.at + 1} of {trace.count}
          </span>
          {trace.count > 1 && (
            <button
              type="button"
              className="btn"
              aria-label="Next place"
              onClick={() => {
                const at = (trace.at + 1) % trace.count;
                setTrace({ ...trace, at });
                goToEntry(trace.ids, at);
              }}
            >
              <ChevronDown className="ico" aria-hidden="true" />
              Next
            </button>
          )}
          <button type="button" className="btn" aria-label="Stop showing evidence (Esc)" onClick={clearTrace}>
            <X className="ico" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

// ── Find in document ──
// Uses the CSS Custom Highlight API: matches are painted by the browser from Ranges,
// so React's DOM is never modified. Without the API it still counts and scrolls.
type HighlightsRegistry = { set(name: string, h: unknown): void; delete(name: string): void };
const highlights = (): HighlightsRegistry | null =>
  typeof CSS !== "undefined" && "highlights" in CSS ? (CSS as unknown as { highlights: HighlightsRegistry }).highlights : null;
const Hl = () => (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;

function findRanges(term: string): Range[] {
  const root = document.getElementById("doc");
  if (!root || term.length < 2) return [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement?.closest(".print-only, [data-nofind], script, style, textarea, button.copy")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const t = term.toLowerCase();
  const out: Range[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const text = node.data.toLowerCase();
    for (let i = text.indexOf(t); i !== -1; i = text.indexOf(t, i + t.length)) {
      const r = document.createRange();
      r.setStart(node, i);
      r.setEnd(node, i + t.length);
      out.push(r);
    }
  }
  return out;
}

function FindBar({ onClose }: { onClose: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [ranges, setRanges] = useState<Range[]>([]);
  const [at, setAt] = useState(0);

  useEffect(() => {
    input.current?.focus();
    return () => {
      highlights()?.delete("find");
      highlights()?.delete("find-now");
    };
  }, []);

  useEffect(() => {
    const found = findRanges(term);
    // Derived from the live DOM, which React can't compute during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRanges(found);
    setAt(0);
    const reg = highlights();
    const H = Hl();
    if (reg && H) reg.set("find", new H(...found));
  }, [term]);

  useEffect(() => {
    const r = ranges[at];
    const reg = highlights();
    const H = Hl();
    if (!r) {
      reg?.delete("find-now");
      return;
    }
    if (reg && H) reg.set("find-now", new H(r));
    // A match inside closed "Details" has no box until it opens.
    const details = r.startContainer.parentElement?.closest("details");
    if (details && !details.open) details.open = true;
    requestAnimationFrame(() => {
      const box = r.getBoundingClientRect();
      window.scrollTo({ top: box.top + window.scrollY - window.innerHeight / 2, behavior: "smooth" });
    });
  }, [ranges, at]);

  const step = (d: number) => ranges.length && setAt((a) => (a + d + ranges.length) % ranges.length);

  return (
    <div className="find" role="search">
      <Search className="ico" aria-hidden="true" />
      <input
        ref={input}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            step(e.shiftKey ? -1 : 1);
          }
          if (e.key === "Escape") onClose();
        }}
        placeholder="Find in document"
        aria-label="Find in document"
      />
      <output aria-live="polite">{term.length < 2 ? "" : ranges.length ? `${at + 1} of ${ranges.length}` : "none"}</output>
      <button type="button" className="btn" onClick={() => step(-1)} aria-label="Previous match (Shift+Enter)">
        <ChevronUp className="ico" aria-hidden="true" />
      </button>
      <button type="button" className="btn" onClick={() => step(1)} aria-label="Next match (Enter)">
        <ChevronDown className="ico" aria-hidden="true" />
      </button>
      <button type="button" className="btn" onClick={onClose} aria-label="Close find (Esc)">
        <X className="ico" aria-hidden="true" />
      </button>
    </div>
  );
}
