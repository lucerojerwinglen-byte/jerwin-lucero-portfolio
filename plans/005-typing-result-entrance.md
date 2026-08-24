# 005 — Give the typing test "Done" message an entrance

- **Status**: DONE
- **Commit**: 01d027a
- **Severity**: LOW
- **Category**: Missed opportunity (state change that teleports)
- **Estimated scope**: 1 file, 1 element's className

## Problem

`src/components/TypingGame.tsx` shows a result line the instant the typing
test finishes:

```tsx
// src/components/TypingGame.tsx:166-170 — current
{finished && (
  <p className="mt-3 text-sm text-accent">
    Done — {wpm} WPM at {accuracy}% accuracy. Try another one?
  </p>
)}
```

This is a conditionally-mounted element appearing in response to a user
action (finishing the test) — structurally identical to the `{activeTag &&
(...)}` filter-chip pattern in `ProjectsSection.tsx`, which already gets a
soft scale+fade entrance. This result message pops in with no transition at
all, an abrupt appearance right at the payoff moment of the interaction.

Note: the target-snippet swap on "New snippet" reset (also flagged in the
audit as a related missed opportunity) is intentionally **out of scope**
for this plan — that text is visible from initial page load, and applying
an entrance transition to it risks visibly conflicting with the section's
own scroll-triggered reveal (`reveal-scroll`, via `Section.tsx`) on first
paint. It would need a design decision beyond a mechanical fix and is left
for a separate, dedicated plan if pursued.

## Target

Apply the exact same conditional-entrance pattern already used for the
filter chip in `ProjectsSection.tsx:79` — Tailwind v4's `starting:` variant,
scaling from 0.95 and fading in over 150ms with the repo's standard
ease-out token:

```tsx
/* target — src/components/TypingGame.tsx:166-170 */
{finished && (
  <p className="mt-3 scale-100 text-sm text-accent opacity-100 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0">
    Done — {wpm} WPM at {accuracy}% accuracy. Try another one?
  </p>
)}
```

Only the `className` changes. No JSX structure, text, or logic changes.

## Repo conventions to follow

- This is a direct copy of the existing pattern at
  `src/components/ProjectsSection.tsx:75-84`:
  ```tsx
  <button
    type="button"
    onClick={() => setActiveTag(null)}
    className="mb-6 inline-flex scale-100 items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-background opacity-100 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0"
  >
  ```
  Same duration (150ms), same easing token (`--ease-out`), same
  `starting:scale-95 starting:opacity-0` → `scale-100 opacity-100` shape.
  This is this codebase's established convention for "an element that
  mounts in response to a user action should scale+fade in, not just
  appear" — apply it verbatim, only changing the base utility classes that
  differ (font size, color, margin) to match what `TypingGame.tsx`'s result
  line already had.

## Steps

1. In `src/components/TypingGame.tsx`, on the `<p>` at line 167, replace the
   `className` value `"mt-3 text-sm text-accent"` with:
   `"mt-3 scale-100 text-sm text-accent opacity-100 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0"`

## Boundaries

- Do NOT touch the target-snippet swap-on-reset behavior — explicitly out
  of scope per the Problem section above.
- Do NOT touch any other element in `TypingGame.tsx` (the mascot box, the
  snippet display, the input, the WPM/accuracy stats, the "New snippet"
  button).
- Do NOT introduce a new easing curve or duration — reuse `--ease-out` and
  150ms exactly as `ProjectsSection.tsx:79` does.
- If line 167 no longer reads `<p className="mt-3 text-sm text-accent">`
  (drift since commit `01d027a`), STOP and report instead of guessing.

## Verification

- **Mechanical**: `npm run lint` and `npx tsc --noEmit` both pass with no
  new errors.
- **Feel check**:
  - Load the typing test section, type the full snippet to trigger the
    finished state.
  - Confirm the "Done — X WPM..." message scales up from ~95% and fades in
    over ~150ms rather than snapping into view instantly.
  - Click "New snippet" to reset, then complete the test again — confirm
    the entrance replays each time (the element unmounts on reset since
    `finished` becomes `false`, so `starting:` re-applies on next mount,
    same as the filter chip's re-entrance behavior in `ProjectsSection`).
  - In DevTools' Animations panel, set playback to 10% and confirm the
    scale+opacity transition runs smoothly with no jump at either end.
- **Done when**: the result message scales and fades in on every completion
  instead of appearing instantly, using the exact 150ms `--ease-out`
  scale-from-0.95 pattern already established by the project filter chip.
