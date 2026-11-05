/** "smooth" unless the visitor asked the OS for reduced motion (DESIGN.md: motion is off then). */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
