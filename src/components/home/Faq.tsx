"use client";

import { useEffect } from "react";
import { faq } from "@/content/home/home";

/**
 * FAQ (ADR 0007): a native exclusive accordion (`<details name>`: one open at a time, state
 * announced by the browser). Arriving at `#faq-…` (e.g. from the Ask palette) opens that answer.
 */
export function Faq() {
  useEffect(() => {
    const openFromHash = () => {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <div className="faq" aria-label="Frequently asked questions" role="region">
      <span className="caps">Quick answers</span>
      {faq.map((f) => (
        <details key={f.id} id={f.id} name="faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
