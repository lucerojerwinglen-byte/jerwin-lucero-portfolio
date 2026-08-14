"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { site } from "@/content/data/site";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "credentials", label: "Certifications & Seminars" },
  { id: "typing-test", label: "Typing Speed Test" },
  { id: "contact", label: "Contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isToggle =
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "j" && e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function goToSection(id: string) {
    setOpen(false);
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed left-1/2 top-24 z-50 w-[min(560px,90vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
    >
      <Command.Input
        placeholder="Type a command or search..."
        className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent placeholder:text-muted"
      />
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="p-4 text-sm text-muted">
          No results found.
        </Command.Empty>

        <Command.Group
          heading="Navigate"
          className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted [&_[cmdk-item]]:mt-1"
        >
          {sections.map((s) => (
            <Command.Item
              key={s.id}
              onSelect={() => goToSection(s.id)}
              className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
            >
              {s.label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group
          heading="Blog"
          className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted [&_[cmdk-item]]:mt-1"
        >
          <Command.Item
            onSelect={() => {
              setOpen(false);
              router.push("/blog");
            }}
            className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            View all posts
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Actions"
          className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted [&_[cmdk-item]]:mt-1"
        >
          <Command.Item
            onSelect={() => {
              setOpen(false);
              window.open(site.resumePdfPath, "_blank");
            }}
            className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            Download resume (PDF)
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
            className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            Toggle light / dark theme
          </Command.Item>
          <Command.Item
            onSelect={() => {
              navigator.clipboard.writeText(site.email);
              toast.success("Email copied to clipboard");
              setOpen(false);
            }}
            className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            Copy email address
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Links"
          className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted [&_[cmdk-item]]:mt-1"
        >
          <Command.Item
            onSelect={() => {
              setOpen(false);
              window.open(site.social.github, "_blank");
            }}
            className="cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            Open GitHub profile
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
