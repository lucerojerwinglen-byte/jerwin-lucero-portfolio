"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { site } from "@/content/data/site";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "credentials", label: "Certifications" },
  { id: "typing-test", label: "Typing test" },
];

const utilityLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Hire me" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={cn(
                    "-mx-2 rounded-md px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-ink",
                    activeSection === link.id && "text-ink"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="my-3 h-px bg-gray-200" />

          <div className="flex flex-col gap-0.5">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="-mx-2 rounded-md px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-ink"
              >
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
            className="-mr-2.5 flex h-11 w-11 items-center justify-center text-gray-700 hover:text-ink"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen nav ── */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
            <Link href="/" className="font-pixel text-[14px]" onClick={() => setOpen(false)}>
              {site.shortName}
            </Link>
            <button
              type="button"
              className="-mr-2.5 flex h-11 w-11 items-center justify-center text-gray-700 hover:text-ink"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-ink"
                  >
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
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-8">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
