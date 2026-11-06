// Accessibility panel settings (ADR 0007). Stored per visitor; applied as attributes on <html>
// so the homepage CSS (home.css) and motion helpers can read them.

export type Display = { largerText: boolean; reduceMotion: boolean; readableFont: boolean };

export const DEFAULT_DISPLAY: Display = { largerText: false, reduceMotion: false, readableFont: false };
export const DISPLAY_KEY = "home-display";

/** Never throws: blocked storage, missing keys and garbage all fall back to the defaults. */
export function loadDisplay(storage: Storage | null): Display {
  try {
    const raw = storage?.getItem(DISPLAY_KEY);
    if (!raw) return { ...DEFAULT_DISPLAY };
    const v = JSON.parse(raw) as Partial<Record<keyof Display, unknown>>;
    return {
      largerText: v.largerText === true,
      reduceMotion: v.reduceMotion === true,
      readableFont: v.readableFont === true,
    };
  } catch {
    return { ...DEFAULT_DISPLAY };
  }
}

export function saveDisplay(storage: Storage | null, d: Display): void {
  try {
    storage?.setItem(DISPLAY_KEY, JSON.stringify(d));
  } catch {
    // Blocked mid-session: the choice still applies to this visit, it just isn't remembered.
  }
}

/** One attribute per setting; null means "remove it". */
export function displayAttributes(d: Display): Record<"data-text" | "data-motion" | "data-font", string | null> {
  return {
    "data-text": d.largerText ? "large" : null,
    "data-motion": d.reduceMotion ? "reduce" : null,
    "data-font": d.readableFont ? "readable" : null,
  };
}

export function applyDisplay(root: HTMLElement, d: Display): void {
  for (const [name, value] of Object.entries(displayAttributes(d))) {
    if (value === null) root.removeAttribute(name);
    else root.setAttribute(name, value);
  }
}

/**
 * Runs inline before the page paints, so a returning visitor never sees a flash of the default
 * size or font. Mirrors loadDisplay + applyDisplay; kept tiny and wrapped in try/catch.
 */
export const DISPLAY_BOOT_SCRIPT = `try{var d=JSON.parse(localStorage.getItem("${DISPLAY_KEY}")||"{}"),r=document.documentElement;if(d.largerText===true)r.setAttribute("data-text","large");if(d.reduceMotion===true)r.setAttribute("data-motion","reduce");if(d.readableFont===true)r.setAttribute("data-font","readable")}catch(e){}`;
