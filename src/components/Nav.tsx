"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  FolderGit2,
  Briefcase,
  Terminal,
  Award,
  Keyboard,
  Mail,
  Newspaper,
  ScanSearch,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { site } from "@/content/data/site";
import { projects } from "@/content/data/projects";
import { skills } from "@/content/data/skills";
import { credentials } from "@/content/data/credentials";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { id: "about", label: "Overview", icon: User, number: null },
  { id: "fit", label: "Check my fit", icon: ScanSearch, number: null },
  { id: "projects", label: "Projects", icon: FolderGit2, number: "01" },
  { id: "experience", label: "Experience", icon: Briefcase, number: "02" },
  { id: "skills", label: "Stack", icon: Terminal, number: "03" },
  { id: "credentials", label: "Certifications", icon: Award, number: "04" },
  { id: "typing-test", label: "Typing test", icon: Keyboard, number: "05" },
  { id: "contact", label: "Contact", icon: Mail, number: "06" },
];

const utilityLinks = [{ href: "/blog", label: "Blog", icon: Newspaper }];

const MENU_EXIT_MS = 260;

// The Reconciliation Rail: a live audit log printed into the sidebar as each
// chapter is reached. Every number here is real, pulled straight from the
// content data — no invented stats.
const TOTAL_PROJECTS = projects.length;
const TOTAL_SKILLS = skills.reduce((n, group) => n + group.items.length, 0);
const TOTAL_CREDENTIALS = credentials.length;

const ledgerCopy: Record<string, { code: string; line: string }> = {
  about: { code: "REC-00", line: "Case file opened" },
  fit: { code: "AUDIT", line: "Fit check standing by" },
  projects: { code: "REC-01", line: `${TOTAL_PROJECTS} projects on record` },
  skills: { code: "REC-03", line: `${TOTAL_SKILLS} competencies logged` },
  credentials: { code: "REC-04", line: `${TOTAL_CREDENTIALS} credentials verified` },
  "typing-test": { code: "REC-05", line: "Live capability check" },
};

function stamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [renderMenu, setRenderMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [printed, setPrinted] = useState<{ id: string; time: string }[]>([]);

  function openMenu() {
    setRenderMenu(true);
    // Mount first, then flip to the open state on the next frame so the
    // enter transition actually runs instead of starting already-open.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }

  function closeMenu() {
    setOpen(false);
    setTimeout(() => setRenderMenu(false), MENU_EXIT_MS);
  }

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            const id = entry.target.id;
            setPrinted((prev) => (prev.some((p) => p.id === id) ? prev : [...prev, { id, time: stamp() }]));
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    for (const link of sectionLinks) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ── Fixed left sidebar (lg+) ── */}
      <nav className="fixed inset-y-0 left-0 z-50 hidden w-[272px] flex-col border-r border-gray-200 bg-rail px-5 py-6 lg:flex">
        {/* ID card */}
        <Link href="/" className="block shrink-0 rounded-[18px] border border-gray-200 bg-surface p-3 transition-shadow duration-200 hover:shadow-[var(--lift)]">
          <Image
            src="/images/jerwin-hero.png"
            alt={site.name}
            width={448}
            height={360}
            priority
            className="aspect-[3/2] w-full rounded-[12px] bg-gray-100 object-cover object-top"
          />
          <span className="mt-3 block font-display text-[19px] leading-tight">{site.shortName}</span>
          <span className="mt-0.5 block text-[12px] text-gray-500">Metro Manila · UTC+8</span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-verified">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Open to QA, data &amp; AI roles
          </span>
        </Link>

        <div className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden font-mono text-[13px]">
          {isHome && (
            <div className="flex flex-col gap-0.5">
              {sectionLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-gray-500 transition-colors hover:bg-surface hover:text-ink",
                      isActive && "bg-surface text-ink"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3.5 w-[3px] shrink-0 rounded-full transition-colors",
                        isActive ? "bg-mark" : "bg-transparent"
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{link.label}</span>
                    {isActive && link.number && (
                      <span className="font-mono text-[10px] tabular-nums text-gray-400">
                        REC-{link.number}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {isHome && printed.length > 0 && (
            <div className="elevate-1 mt-4 rounded-lg border border-gray-200 bg-card px-2.5 py-2.5">
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wide text-gray-400">
                <span>Ledger</span>
                <span className="tabular-nums">
                  {printed.length}/{sectionLinks.length} reconciled
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-2">
                {printed.map((p) => {
                  if (p.id === "experience") {
                    return (
                      <li key={p.id} className="reveal font-mono text-[11px] leading-snug">
                        <div className="flex items-baseline justify-between text-gray-400">
                          <span>REC-02</span>
                          <span className="tabular-nums">{p.time}</span>
                        </div>
                        <p className="text-gray-400 line-through decoration-1">HR Transactions Analyst</p>
                        <p className="text-verified">→ QA · Data · AI</p>
                      </li>
                    );
                  }
                  if (p.id === "contact") {
                    return (
                      <li
                        key={p.id}
                        className="elevate-1 reveal rounded border border-verified/30 bg-verified/10 px-2 py-1.5 font-mono text-[11px] text-verified"
                      >
                        <div className="flex items-baseline justify-between">
                          <span>REC-06</span>
                          <span className="tabular-nums">{p.time}</span>
                        </div>
                        <p className="mt-0.5 font-semibold tracking-wide">RECONCILED — BALANCED</p>
                      </li>
                    );
                  }
                  const entry = ledgerCopy[p.id];
                  if (!entry) return null;
                  return (
                    <li key={p.id} className="reveal font-mono text-[11px] leading-snug">
                      <div className="flex items-baseline justify-between text-gray-400">
                        <span>{entry.code}</span>
                        <span className="tabular-nums">{p.time}</span>
                      </div>
                      <p className="text-gray-600">{entry.line}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="my-3 h-px bg-gray-200" />

          <div className="flex flex-col gap-0.5">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-ink"
              >
                <link.icon className="h-3.5 w-3.5 shrink-0" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 shrink-0">
          <PresenceIndicator />
          <div className="mb-4 mt-3.5 flex items-center gap-2">
            <ThemeToggle />
          </div>
          <p className="text-[12px] leading-relaxed text-gray-500">
            &copy; {new Date().getFullYear()} {site.shortName}
          </p>
        </div>
      </nav>

      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-background/90 backdrop-blur-md lg:hidden">
        <div className="relative mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-display text-[14px]">
            {site.shortName}
          </Link>
          {isHome && activeSection && (
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-gray-400">
              {sectionLinks.find((link) => link.id === activeSection)?.label}
            </span>
          )}
          <button
            type="button"
            className="relative -mr-2.5 flex h-11 w-11 items-center justify-center text-gray-700 hover:text-ink"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <Menu
              className={cn(
                "absolute h-5 w-5 transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
                open ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
              )}
            />
            <X
              className={cn(
                "absolute h-5 w-5 transition-[opacity,transform] duration-150 ease-[var(--ease-out)]",
                open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
              )}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen nav ── */}
      {renderMenu && (
        <div
          className={cn(
            "fixed inset-0 z-[60] flex flex-col bg-background opacity-0 transition-opacity duration-200 ease-[var(--ease-out)] lg:hidden",
            open && "opacity-100"
          )}
        >
          <div
            className={cn(
              "flex flex-1 flex-col opacity-0 transition-[opacity,transform] duration-[260ms] ease-[var(--ease-out)] motion-reduce:translate-y-0",
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
              <Link href="/" className="font-display text-[14px]" onClick={closeMenu}>
                {site.shortName}
              </Link>
              <button
                type="button"
                className="-mr-2.5 flex h-11 w-11 items-center justify-center text-gray-700 hover:text-ink"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-5 py-8 font-mono text-[16px]">
              {isHome && (
                <div className="flex flex-col gap-1">
                  {sectionLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-ink"
                    >
                      <link.icon className="h-4 w-4 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              <div className="my-6 h-px bg-gray-200" />
              <div className="flex flex-col gap-1">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-ink"
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-2 pt-8">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
