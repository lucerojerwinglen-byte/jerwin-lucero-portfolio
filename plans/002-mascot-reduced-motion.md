# 002 — Gate WASD mascot movement behind prefers-reduced-motion

- **Status**: DONE
- **Commit**: 01d027a
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~5 lines

## Problem

`src/components/TypingGame.tsx` moves a small dot marker around a 90x90px
box in response to WASD keypresses, animated with a CSS transition:

```tsx
// src/components/TypingGame.tsx:95-104 — current
<div className="relative mb-5 h-24 overflow-hidden rounded-xl border border-border bg-card">
  <div
    className="absolute h-3 w-3 rounded-full bg-accent transition-transform duration-100"
    style={{
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${mascotPos.x}px), calc(-50% + ${mascotPos.y}px))`,
    }}
  />
</div>
```

```tsx
// src/components/TypingGame.tsx:73-84 — current
function handleMascotKey(e: React.KeyboardEvent) {
  if (startedAt) return;
  const key = e.key.toLowerCase();
  setMascotPos((pos) => {
    const next = { ...pos };
    if (key === "w") next.y = Math.max(pos.y - MASCOT_STEP, -MASCOT_BOUNDS.height);
    if (key === "s") next.y = Math.min(pos.y + MASCOT_STEP, MASCOT_BOUNDS.height);
    if (key === "a") next.x = Math.max(pos.x - MASCOT_STEP, -MASCOT_BOUNDS.width);
    if (key === "d") next.x = Math.min(pos.x + MASCOT_STEP, MASCOT_BOUNDS.width);
    return next;
  });
}
```

Every other animated element in this codebase checks
`prefers-reduced-motion` before animating movement — `.reveal`,
`.reveal-scroll`, `.pulse-dot`, `.theme-switch-indicator`, and the theme
crossfade all have `@media (prefers-reduced-motion: reduce)` overrides in
`src/app/globals.css`, and `Hero.tsx` checks
`window.matchMedia("(prefers-reduced-motion: reduce)").matches` in JS before
computing tilt. The mascot is the one piece of movement in the codebase with
no reduced-motion handling at all.

## Target

Skip the position update entirely when reduced motion is requested, matching
the exact pattern already used in `Hero.tsx`:

```tsx
// target — src/components/TypingGame.tsx, inside handleMascotKey
function handleMascotKey(e: React.KeyboardEvent) {
  if (startedAt) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const key = e.key.toLowerCase();
  setMascotPos((pos) => {
    const next = { ...pos };
    if (key === "w") next.y = Math.max(pos.y - MASCOT_STEP, -MASCOT_BOUNDS.height);
    if (key === "s") next.y = Math.min(pos.y + MASCOT_STEP, MASCOT_BOUNDS.height);
    if (key === "a") next.x = Math.max(pos.x - MASCOT_STEP, -MASCOT_BOUNDS.width);
    if (key === "d") next.x = Math.min(pos.x + MASCOT_STEP, MASCOT_BOUNDS.width);
    return next;
  });
}
```

No changes to the JSX/transition classes on lines 95-104 — with the guard in
place `mascotPos` simply never changes when reduced motion is on, so the dot
stays put; the `transition-transform duration-100` never fires in practice
under that setting.

## Repo conventions to follow

- The exact reduced-motion check to use already exists verbatim in
  `src/components/Hero.tsx:16`:
  ```tsx
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ```
  Copy this pattern precisely — same media query string, same early-return
  style — into `handleMascotKey`.

## Steps

1. In `src/components/TypingGame.tsx`, inside `handleMascotKey` (starting at
   line 73), add the reduced-motion guard as the second line of the
   function, immediately after the existing `if (startedAt) return;` line:
   ```tsx
   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
   ```

## Boundaries

- Do NOT touch the `transition-transform duration-100` class or any other
  JSX in this file — the fix is purely the early-return guard in
  `handleMascotKey`.
- Do NOT add a `useReducedMotion` hook or new dependency — this codebase's
  existing convention (see `Hero.tsx:16`) is a direct `window.matchMedia`
  check, not a hook.
- Do NOT touch `MASCOT_BOUNDS`, `MASCOT_STEP`, or any other component.
- If `handleMascotKey` no longer starts with `if (startedAt) return;` at
  line 73 (drift since commit `01d027a`), STOP and report instead of
  guessing where to insert the guard.

## Verification

- **Mechanical**: `npm run lint` and `npx tsc --noEmit` both pass with no
  new errors.
- **Feel check**:
  - In Chrome DevTools, open the Rendering panel and set "Emulate CSS media
    feature prefers-reduced-motion" to "reduce".
  - Load the typing test section, focus the mascot box, and press W/A/S/D.
  - Confirm the dot does not move at all (previously it nudged by 8px per
    keypress).
  - Turn the emulation back to "No emulation" and confirm WASD still moves
    the dot exactly as before (8px steps, clamped to the 90x90 bounds,
    animated over the existing 100ms transition).
- **Done when**: with `prefers-reduced-motion: reduce` active, WASD presses
  produce no dot movement, and with it inactive the existing behavior is
  unchanged.
