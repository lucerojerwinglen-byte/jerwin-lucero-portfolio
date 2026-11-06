// Navigating anywhere else clears the sheet slot; without this an open sheet would stay on screen
// after a soft navigation to another page (ADR 0007).
export default function NoSheet() {
  return null;
}
