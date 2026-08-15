"use client";

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
  Newspaper,
  Handshake,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { site } from "@/content/data/site";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { id: "about", label: "About", icon: User, number: null },
  { id: "projects", label: "Projects", icon: FolderGit2, number: "01" },
  { id: "experience", label: "Experience", icon: Briefcase, number: "02" },
  { id: "skills", label: "Stack", icon: Terminal, number: "03" },
  { id: "credentials", label: "Certifications", icon: Award, number: "04" },
  { id: "typing-test", label: "Typing test", icon: Keyboard, number: "05" },
];

const utilityLinks = [
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/#contact", label: "Hire me", icon: Handshake },
];

const MENU_EXIT_MS = 180;

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [renderMenu, setRenderMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
      <nav className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-gray-200 bg-background px-7 py-8 lg:flex">
        <Link href="/" className="shrink-0 font-pixel text-[15px] leading-none hover:opacity-60">
          {site.shortName}
        </Link>

        <div className="mt-9 flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden font-mono text-[13px]">
          {isHome && (
            <div className="flex flex-col gap-0.5">
              {sectionLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={cn(
                      "-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-ink",
                      isActive && "text-ink"
                    )}
                  >
                    <link.icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1">{link.label}</span>
                    {isActive && link.number && (
                      <span className="font-pixel text-[10px] text-gray-400">{link.number}</span>
                    )}
                  </a>
                );
              })}
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
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-pixel text-[14px]">
            {site.shortName}
          </Link>
          <button
            type="button"
            className="relative -mr-2.5 flex h-11 w-11 items-center justify-center text-gray-700 hover:text-ink"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <Menu
              className={cn(
                "absolute h-5 w-5 transition-[opacity,transform] duration-150 ease-[var(--ease-out)]",
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
            "fixed inset-0 z-[60] flex flex-col bg-background opacity-0 transition-opacity duration-150 ease-[var(--ease-out)] lg:hidden",
            open && "opacity-100"
          )}
        >
          <div
            className={cn(
              "flex flex-1 flex-col opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out)] motion-reduce:translate-y-0",
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
              <Link href="/" className="font-pixel text-[14px]" onClick={closeMenu}>
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
