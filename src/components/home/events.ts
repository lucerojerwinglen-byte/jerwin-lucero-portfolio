// The sidebar, footer and keyboard all open the same overlays. A window event keeps them
// decoupled: whoever renders <Overlays /> listens, everyone else just announces.
export type Overlay = "ask" | "typing" | "tour";
export const OVERLAY_EVENT = "home:overlay";

export function openOverlay(which: Overlay) {
  window.dispatchEvent(new CustomEvent<Overlay>(OVERLAY_EVENT, { detail: which }));
}
