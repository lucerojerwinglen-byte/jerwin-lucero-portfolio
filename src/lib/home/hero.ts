/**
 * The hero's tiny markup (src/content/home/home.ts):
 *   {software engineer}             typed + highlighted title
 *   [web]                           pill with that name's logo (src/lib/logos.ts)
 *   *curious*                       highlighted word, no logo
 *   [Claude+ChatGPT+Gemini|label]   stacked logos followed by a label
 */
export type HeroToken =
  | { kind: "text"; text: string }
  | { kind: "typed"; text: string }
  | { kind: "logo"; name: string }
  | { kind: "word"; text: string }
  | { kind: "stack"; names: string[]; label: string };

export function parseHero(source: string): HeroToken[] {
  const out: HeroToken[] = [];
  let last = 0;
  for (const m of source.matchAll(/\{([^}]+)\}|\[([^\]]+)\]|\*([^*]+)\*/g)) {
    if (m.index > last) out.push({ kind: "text", text: source.slice(last, m.index) });
    const [, typed, bracket, word] = m;
    if (typed) out.push({ kind: "typed", text: typed });
    else if (word) out.push({ kind: "word", text: word });
    else if (bracket.includes("|")) {
      const [names, label] = bracket.split("|");
      out.push({ kind: "stack", names: names.split("+"), label });
    } else out.push({ kind: "logo", name: bracket });
    last = m.index + m[0].length;
  }
  if (last < source.length) out.push({ kind: "text", text: source.slice(last) });
  return out;
}
