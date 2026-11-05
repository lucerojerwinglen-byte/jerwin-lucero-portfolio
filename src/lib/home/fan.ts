/**
 * Where card `i` sits in the fanned stack when `front` is in front:
 * 0 front, 1 tucked behind on the right, -1 behind on the left, null hidden (only with 4+ cards).
 */
export function fanOffset(i: number, front: number, count: number): -1 | 0 | 1 | null {
  const d = (i - front + count) % count;
  if (d === 0) return 0;
  if (d === 1) return 1;
  if (d === count - 1) return -1;
  return null;
}
