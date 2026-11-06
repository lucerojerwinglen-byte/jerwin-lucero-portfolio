/** True when the visitor asked for less motion: in the OS, or with the Accessibility panel (ADR 0007). */
export function prefersReducedMotion(): boolean {
  return (
    document.documentElement.dataset.motion === "reduce" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** "smooth" unless the visitor asked for reduced motion (DESIGN.md: motion is off then). */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}
