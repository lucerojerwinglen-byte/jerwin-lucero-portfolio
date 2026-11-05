"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Laptop,
  Mail,
  Menu,
  Monitor,
  Moon,
  Newspaper,
  ShoppingBag,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { site } from "@/content/data/site";
import { numberSections, sectionLabel, sections, soonPages, type SoonSlug } from "@/content/home/home";
import { usePresence } from "@/components/web/usePresence";
import { openOverlay } from "./events";

// Typed by slug, so adding a coming-soon page without an icon fails the typecheck.
const soonIcon: Record<SoonSlug, typeof ShoppingBag> = {
  shop: ShoppingBag,
  gear: Laptop,
  resources: BookOpen,
  collabs: Users,
  consulting: BriefcaseBusiness,
};
const soon = (slug: SoonSlug) => {
  const page = soonPages.find((p) => p.slug === slug)!;
  return { href: `/${slug}`, label: page.title, Icon: soonIcon[slug] };
};

const navGroups = [
  [soon("shop"), { href: "/blog", label: "Blog", Icon: Newspaper }, soon("gear"), soon("resources")],
  [{ href: "/resume", label: "Résumé", Icon: FileText }, soon("collabs"), soon("consulting")],
];

/** Fixed left sidebar on desktop; a top bar with a menu on phones. */
export function Sidebar({ onHome = true }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const viewers = usePresence();
  const jump = numberSections(sections);

  // The theme is only known in the browser; render the switch neutral until then.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const hash = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <div className="topbar">
        <Link href="/">{site.shortName}</Link>
        <button type="button" aria-expanded={open} aria-controls="side" aria-label={open ? "Close menu" : "Open menu"} title={open ? "Close menu" : "Menu"} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="ico" aria-hidden="true" /> : <Menu className="ico" aria-hidden="true" />}
        </button>
      </div>

      <aside className="side" id="side" data-open={open} data-tour="nav">
        <Link className="brand" href="/">
          {site.shortName}
        </Link>
        <nav aria-label="Site">
          {navGroups.map((group, g) => (
            <div key={g}>
              <ul>
                {group.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link href={href} onClick={close}>
                      <Icon className="ico" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          ))}
          <ul aria-label="Sections">
            {jump.map((s) => (
              <li key={s.id}>
                <a href={hash(s.id)} onClick={close}>
                  {sectionLabel(s)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="spacer" />

        <div className="keys" data-tour="keys">
          <button type="button" onClick={() => (close(), openOverlay("ask"))}>
            Ask anything <kbd>Alt</kbd>+<kbd>K</kbd>
          </button>
          <button type="button" onClick={() => (close(), openOverlay("typing"))}>
            Typing test <kbd>Alt</kbd>+<kbd>J</kbd>
          </button>
        </div>

        {viewers !== null && (
          <>
            <hr />
            <div className="presence" aria-live="polite">
              <span className="avatar" aria-hidden="true">
                <User className="ico" />
              </span>
              <span>
                <b>{viewers}</b> {viewers === 1 ? "person" : "people"} viewing now
              </span>
            </div>
          </>
        )}

        <hr />
        <div className="switch">
          <div className="seg" role="group" aria-label="Theme">
            {(
              [
                ["system", Monitor, "System theme"],
                ["light", Sun, "Light theme"],
                ["dark", Moon, "Dark theme"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                title={label}
                aria-pressed={mounted && theme === value}
                onClick={() => setTheme(value)}
              >
                <Icon className="ico" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <p className="reach">For work, collabs &amp; everything else, reach me at</p>
        <a className="mail" href={`mailto:${site.email}`}>
          <Mail className="ico" aria-hidden="true" />
          {site.email}
        </a>
      </aside>
    </>
  );
}
