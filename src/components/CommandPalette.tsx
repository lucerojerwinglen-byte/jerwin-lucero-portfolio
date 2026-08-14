"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Search,
  User,
  FolderGit2,
  Briefcase,
  Terminal,
  Award,
  Keyboard,
  Mail,
  Newspaper,
  Download,
  SunMoon,
  Copy,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { site } from "@/content/data/site";

const sections = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Stack", icon: Terminal },
  { id: "credentials", label: "Certifications & Seminars", icon: Award },
  { id: "typing-test", label: "Typing Speed Test", icon: Keyboard },
  { id: "contact", label: "Contact", icon: Mail },
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
      <div className="relative border-b border-border">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Command.Input
          placeholder="Type a command or search..."
          className="w-full bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-accent placeholder:text-muted"
        />
      </div>
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
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
            >
              <s.icon className="h-4 w-4 text-muted" />
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
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            <Newspaper className="h-4 w-4 text-muted" />
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
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            <Download className="h-4 w-4 text-muted" />
            Download resume (PDF)
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            <SunMoon className="h-4 w-4 text-muted" />
            Toggle light / dark theme
          </Command.Item>
          <Command.Item
            onSelect={() => {
              navigator.clipboard.writeText(site.email);
              toast.success("Email copied to clipboard");
              setOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            <Copy className="h-4 w-4 text-muted" />
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
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-card"
          >
            <GithubIcon className="h-4 w-4 text-muted" />
            Open GitHub profile
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
