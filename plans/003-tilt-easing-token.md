# 003 — Apply the `--ease-in-out` token to the Hero tilt transition

- **Status**: DONE
- **Commit**: 01d027a
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, 1-line change

## Problem

`src/app/globals.css` defines two easing tokens:

```css
/* src/app/globals.css:14-15 — current */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

`--ease-out` is used throughout the codebase (Nav, CommandPalette,
ContactForm, TypingGame, theme-switch, etc.). `--ease-in-out` is never
referenced by any component — it's a dead token.

Meanwhile, the easing decision rule (entering/exiting → `ease-out`; moving
or morphing on screen → `ease-in-out`) means the one animation in this
codebase that is pure on-screen movement — the Hero portrait's cursor-follow
tilt — is currently using the wrong token for what it does:

```tsx
// src/components/Hero.tsx:40-43 — current
<div
  className="relative transition-transform duration-200 ease-[var(--ease-out)] will-change-transform"
  style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
>
```

The tilt isn't entering or exiting anything — it continuously re-targets
`rotateX`/`rotateY` as the cursor moves and eases back to `0deg, 0deg` on
mouse-leave, which is squarely "moving/morphing on screen."

## Target

Swap the tilt's easing from `--ease-out` to `--ease-in-out`, which puts the
dead token into actual use in exactly the case the audit rule calls for:

```tsx
/* target — src/components/Hero.tsx:40-43 */
<div
  className="relative transition-transform duration-200 ease-[var(--ease-in-out)] will-change-transform"
  style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
>
```

No other properties, durations, or files change.

## Repo conventions to follow

- Easing tokens live in `:root` in `src/app/globals.css` and are consumed
  via Tailwind's arbitrary-value syntax `ease-[var(--token-name)]`. The
  exemplar for this exact syntax is the line being changed itself —
  `Hero.tsx:41` already uses `ease-[var(--ease-out)]`; only the token name
  inside the brackets changes to `--ease-in-out`.

## Steps

1. In `src/components/Hero.tsx`, on the `className` string at line 41,
   change `ease-[var(--ease-out)]` to `ease-[var(--ease-in-out)]`. The full
   className becomes:
   `"relative transition-transform duration-200 ease-[var(--ease-in-out)] will-change-transform"`

## Boundaries

- Do NOT change `duration-200`, `will-change-transform`, or any other class
  on this element.
- Do NOT touch `--ease-out` or `--ease-in-out`'s definitions in
  `globals.css` — both values are correct as defined; this plan only
  changes which one `Hero.tsx` references.
- Do NOT touch any other `ease-[var(--ease-out)]` usage elsewhere in the
  codebase (Nav, CommandPalette, ContactForm, TypingGame, etc.) — those are
  all entering/exiting animations, where `--ease-out` is the correct choice
  and stays unchanged.
- If `Hero.tsx:41` no longer reads `ease-[var(--ease-out)]` (drift since
  commit `01d027a`), STOP and report instead of guessing.

## Verification

- **Mechanical**: `npm run lint` and `npx tsc --noEmit` both pass with no
  new errors (Tailwind arbitrary-value classes aren't statically checked, so
  this step just confirms nothing else broke).
- **Feel check**:
  - Load the homepage on a pointer-capable device/viewport (sm breakpoint or
    wider, so the portrait tilt is visible).
  - Move the mouse across the portrait slowly and confirm the tilt still
    tracks the cursor smoothly with no visible change in responsiveness on
    entry (it should still feel immediate when you start moving the mouse
    into the image — `ease-in-out` and `ease-out` share the same fast
    start... actually confirm this explicitly: `--ease-in-out` here is
    `cubic-bezier(0.77, 0, 0.175, 1)`, which starts *slow* rather than fast.
    Compare directly against the current build before merging — if the tilt
    now feels sluggish to engage rather than smooth to move, note that in
    the PR rather than silently keeping the swap).
  - Move the mouse off the portrait and confirm the tilt eases back to flat
    (0deg, 0deg) over the same 200ms.
- **Done when**: `Hero.tsx:41` references `ease-[var(--ease-in-out)]`, and a
  human has visually confirmed the swapped curve still feels good on
  cursor-follow (this is a feel judgment call, not just a mechanical diff —
  flag it for review rather than assuming it's an improvement).
