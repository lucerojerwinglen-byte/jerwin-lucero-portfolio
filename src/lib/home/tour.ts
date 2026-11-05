const KEY = "home-tour-seen";

/**
 * The browser's localStorage, or null when it's blocked. Merely reading `window.localStorage`
 * throws a SecurityError when site data is blocked, so callers must go through this.
 */
export function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// With no usable storage we can't remember a dismissal, so treat the tour as seen
// rather than showing it on every visit.
export function hasSeenTour(storage: Storage | null): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

export function markTourSeen(storage: Storage | null): void {
  try {
    storage?.setItem(KEY, "1");
  } catch {
    // Blocked mid-session: nowhere to remember it. The visitor just sees it again next visit.
  }
}

export function resetTour(storage: Storage | null): void {
  try {
    storage?.removeItem(KEY);
  } catch {
    // Blocked: nothing was stored, so there is nothing to reset. The tour still opens on request.
  }
}
