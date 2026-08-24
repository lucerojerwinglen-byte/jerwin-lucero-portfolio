# 004 — Soften the project list teleport on tag filtering

- **Status**: DONE
- **Commit**: 01d027a
- **Severity**: MEDIUM
- **Category**: Missed opportunity (state change that teleports)
- **Estimated scope**: 1 file, wrap existing markup (no new elements)

## Problem

`src/components/ProjectsSection.tsx` filters the visible project list by
clicking a tag on any `ProjectCard`. The filtered arrays are recomputed and
React mounts/unmounts `ProjectCard`s instantly with no transition at all:

```tsx
// src/components/ProjectsSection.tsx:69-123 — current
const matches = (p: Project) => !activeTag || p.tags.includes(activeTag);
const engineering = projects.filter((p) => p.category === "engineering" && matches(p));
const academic = projects.filter((p) => p.category === "academic" && matches(p));

return (
  <Section id="projects" number="01" title="projects">
    {activeTag && (
      <button
        type="button"
        onClick={() => setActiveTag(null)}
        className="mb-6 inline-flex scale-100 items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-background opacity-100 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0"
      >
        filtered by {activeTag}
        <X className="h-3 w-3" />
      </button>
    )}

    {engineering.length > 0 && (
      <div className="mb-8">
        <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
          <Rocket className="h-3.5 w-3.5" />
          Shipped &amp; open source
        </h3>
        <div>
          {engineering.map((p) => (
            <ProjectCard key={p.slug} project={p} activeTag={activeTag} onTagClick={handleTagClick} />
          ))}
        </div>
      </div>
    )}

    {academic.length > 0 && (
      <div>
        <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
          <FlaskConical className="h-3.5 w-3.5" />
          Academic &amp; research
        </h3>
        <div>
          {academic.map((p) => (
            <ProjectCard key={p.slug} project={p} activeTag={activeTag} onTagClick={handleTagClick} />
          ))}
        </div>
      </div>
    )}
  </Section>
);
```

Clicking a tag on any card instantly drops every non-matching card and
reflows the list — the exact "state change that teleports" pattern the
missed-opportunities category calls out. The filter chip button already
gets a soft entrance (`starting:scale-95 starting:opacity-0`); the list it
filters gets none.

## Target

Per the performance rule (animate `transform`/`opacity` only — never
animate the individual cards' mount/unmount, which would mean animating
layout/height), the correct fix here is a crossfade of the *whole results
block* on every filter change, reusing this codebase's own existing
entrance primitive: the `.reveal` keyframe class already defined in
`src/app/globals.css:164-178`:

```css
/* src/app/globals.css:165-178 — already exists, do not duplicate */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.reveal {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

Wrap the two conditional result groups in a single container, keyed by the
active filter so React remounts (and therefore replays the `.reveal`
animation) exactly when the filter changes:

```tsx
/* target — src/components/ProjectsSection.tsx, replacing lines 86-123 */
<div key={activeTag ?? "all"} className="reveal">
  {engineering.length > 0 && (
    <div className="mb-8">
      <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
        <Rocket className="h-3.5 w-3.5" />
        Shipped &amp; open source
      </h3>
      <div>
        {engineering.map((p) => (
          <ProjectCard key={p.slug} project={p} activeTag={activeTag} onTagClick={handleTagClick} />
        ))}
      </div>
    </div>
  )}

  {academic.length > 0 && (
    <div>
      <h3 className="mb-1 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-gray-500">
        <FlaskConical className="h-3.5 w-3.5" />
        Academic &amp; research
      </h3>
      <div>
        {academic.map((p) => (
          <ProjectCard key={p.slug} project={p} activeTag={activeTag} onTagClick={handleTagClick} />
        ))}
      </div>
    </div>
  )}
</div>
```

Nothing inside the two inner `div`s changes — only the new outer wrapper
with `key` and `className="reveal"` is added.

## Repo conventions to follow

- Reuse the existing `.reveal` class from `src/app/globals.css:175-178`
  as-is. Do not create a new keyframe, duration, or easing curve — this is
  the exact convention this codebase already uses for "content should fade
  and rise into place" (see `Hero.tsx:33,63,66,70,74,92` for the same class
  applied to the hero's own entrance).
- `.reveal` already has a `prefers-reduced-motion` override at
  `src/app/globals.css:208-217` (`animation: none; opacity: 1; transform: none;`)
  — no additional accessibility work is needed for this plan.
- The `key`-to-force-remount technique is not otherwise used in this
  codebase, but it is the standard React idiom for "replay a mount
  animation on state change," and it composes cleanly with `.reveal`
  because `.reveal`'s `animation` (not `transition`) always plays in full
  from a fresh mount, regardless of how it was triggered.

## Steps

1. In `src/components/ProjectsSection.tsx`, wrap the two conditional blocks
   currently at lines 86-103 (`{engineering.length > 0 && (...)}`) and
   105-122 (`{academic.length > 0 && (...)}`) in a single new `<div>` with
   `key={activeTag ?? "all"}` and `className="reveal"`, as shown in Target
   above. The `{activeTag && (...)}` filter-chip button block (lines 75-84)
   stays outside this new wrapper, unchanged.

## Boundaries

- Do NOT touch the `{activeTag && (...)}` filter chip button (lines 75-84)
  — its own entrance animation is already correct and out of scope.
- Do NOT touch `ProjectCard` itself, or add per-card animations — the fix
  is a single crossfade of the results block, not per-item transitions.
- Do NOT create a new CSS class, keyframe, or duration — reuse `.reveal`
  exactly as defined.
- Do NOT change the `matches`/`filter` logic — only the JSX structure around
  the two result groups changes.
- If lines 86-123 no longer match the current code shown above (drift since
  commit `01d027a`), STOP and report instead of improvising a different
  wrapper location.

## Verification

- **Mechanical**: `npm run lint` and `npx tsc --noEmit` both pass with no
  new errors.
- **Feel check**:
  - Load the Projects section, click a tag on any project card.
  - Confirm the entire results block (both "Shipped & open source" and
    "Academic & research" groups, whichever are present) fades up together
    rather than individual cards popping in/out with an instant layout
    jump.
  - Click a different tag, then click the "filtered by X" chip's close (×)
    to clear the filter — confirm the crossfade replays each time the
    result set changes, including back to the unfiltered list.
  - In DevTools' Animations panel, set playback to 10% on a filter click
    and confirm the block fades in from `opacity: 0, translateY(12px)` to
    fully settled over 500ms — not an instant swap.
  - Toggle `prefers-reduced-motion: reduce` (Rendering panel) and confirm
    the filtered results appear instantly with no animation (opacity 1,
    no translateY), since `.reveal`'s existing reduced-motion override
    handles this automatically.
- **Done when**: clicking any tag (or clearing the filter) crossfades the
  whole results block via the existing `.reveal` animation instead of an
  instant DOM swap, and reduced-motion users see an instant, un-animated
  update.
