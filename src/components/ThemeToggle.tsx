"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
  { value: "system", icon: Monitor, label: "System theme" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[1.6rem] w-[5.1rem]" aria-hidden />;
  }

  const activeIndex = options.findIndex((o) => o.value === theme);

  return (
    <div className="theme-switch">
      <div
        aria-hidden="true"
        className="theme-switch-indicator"
        style={{ transform: `translateX(${Math.max(activeIndex, 0) * 2}rem)` }}
      />
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          className={cn("theme-opt", theme === value && "is-active")}
        >
          <Icon className="h-[13px] w-[13px]" />
        </button>
      ))}
    </div>
  );
}
