"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { site } from "@/content/data/site";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Hire Me" },
];

const sectionLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "credentials", label: "Certifications" },
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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          {site.shortName}
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <PresenceIndicator />
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isHome && (
        <div className="hidden border-t border-border/60 md:block">
          <div className="mx-auto flex max-w-4xl gap-5 overflow-x-auto px-6 py-2 text-sm">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  "whitespace-nowrap text-muted transition-colors hover:text-foreground",
                  activeSection === link.id && "font-medium text-accent"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {open && (
        <nav className="border-t border-border px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            {isHome &&
              sectionLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
