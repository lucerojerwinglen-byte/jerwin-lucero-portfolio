# 001 — Fix mobile menu exit-timing mismatch

- **Status**: DONE
- **Commit**: 01d027a
- **Severity**: MEDIUM
- **Category**: Interruptibility & Cohesion
- **Estimated scope**: 1 file, 1-line change

## Problem

`src/components/Nav.tsx` closes the mobile full-screen menu by flipping
`open` to `false` (which starts the CSS exit transitions) and then unmounting
the menu from the DOM after a fixed `setTimeout`:

```tsx
// src/components/Nav.tsx:37
const MENU_EXIT_MS = 180;

// src/components/Nav.tsx:53-56
function closeMenu() {
  setOpen(false);
  setTimeout(() => setRenderMenu(false), MENU_EXIT_MS);
}
```

But the two elements that actually animate on close have different exit
durations:

```tsx
// src/components/Nav.tsx:176-179 — outer overlay: 150ms
<div
  className={cn(
    "fixed inset-0 z-[60] flex flex-col bg-background opacity-0 transition-opacity duration-150 ease-[var(--ease-out)] lg:hidden",
    open && "opacity-100"
  )}
>

// src/components/Nav.tsx:182-185 — inner panel: 200ms
<div
  className={cn(
    "flex flex-1 flex-col opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out)] motion-reduce:translate-y-0",
    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
  )}
>
```

The inner panel's exit transition (translateY + opacity) takes 200ms, but
`MENU_EXIT_MS` unmounts the whole menu at 180ms — 20ms before that
transition finishes. The panel gets yanked out of the DOM mid-animation on
every close.

## Target

`MENU_EXIT_MS` must be greater than or equal to the longest exit transition
duration among the elements it's waiting on (currently 200ms, the inner
panel). Set it to exactly 200 so the unmount happens the instant the slowest
exit transition completes, with no dead wait added:

```tsx
// target
const MENU_EXIT_MS = 200;
```

No other lines change. The 150ms and 200ms Tailwind duration classes on the
two divs stay as they are — this plan only fixes the JS timer that was
racing them.

## Repo conventions to follow

- Durations are expressed as Tailwind `duration-*` utility classes on the
  animated element, and as a matching plain-number `_MS` constant in JS when
  a `setTimeout` needs to wait for a CSS transition to finish. There is only
  one such pattern in this codebase (`MENU_EXIT_MS` itself) — after this fix
  it should read as the correct exemplar of that pattern for any future
  addition.

## Steps

1. In `src/components/Nav.tsx`, change line 37 from
   `const MENU_EXIT_MS = 180;` to `const MENU_EXIT_MS = 200;`.

## Boundaries

- Do NOT touch the `duration-150` or `duration-200` Tailwind classes on
  lines 177 and 183 — those are correct as-is; only the JS constant was wrong.
- Do NOT touch `openMenu`, the desktop sidebar nav, or any other component.
- Do NOT add new dependencies or a transitionend listener — a corrected
  constant is the minimal, correct fix here.
- If the JSX around lines 37, 53-56, 176-185 has changed since commit
  `01d027a` (e.g. the durations are no longer 150/200ms), STOP and report
  instead of guessing a new number — recompute `MENU_EXIT_MS` from whatever
  the new longest exit duration actually is.

## Verification

- **Mechanical**: `npm run lint` and `npx tsc --noEmit` both pass with no
  new errors (this is a one-line numeric change, so this should be trivial).
- **Feel check**:
  - Resize the browser to a mobile width (or use DevTools device toolbar) so
    the mobile header/menu renders.
  - Open the menu, then close it, with the DevTools Elements panel open on
    the menu's inner panel `<div>` (the one with `transition-[opacity,transform]`).
  - Confirm the inner panel's opacity reaches 0 and its transform finishes
    settling to `-translate-y-2` *before* the node is removed from the DOM
    (no visible jump/cut-off right at the end of the close animation).
  - In DevTools' Animations panel, set playback to 10% and trigger a close;
    confirm the panel completes its full translate+fade before disappearing.
- **Done when**: `MENU_EXIT_MS` equals 200, and closing the mobile menu at
  10% playback speed shows the inner panel's exit transition running to
  completion with no early unmount.
