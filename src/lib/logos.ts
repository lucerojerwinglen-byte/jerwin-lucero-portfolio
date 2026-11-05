// Server-only: which logo each tech / tool / issuer name shows (ADR 0006). Logos keep their
// brand colours. Never import from a client component: the Iconify set is 8 MB of JSON and only
// the SVGs actually rendered should reach the browser. Guarded by logos.test.ts.
import icons from "@iconify-json/logos/icons.json";
import {
  Bot,
  BrainCircuit,
  Clapperboard,
  ClipboardCheck,
  Film,
  SquareTerminal,
  Database,
  Eye,
  FlaskConical,
  Languages,
  Lock,
  MessageSquareText,
  Monitor,
  Pickaxe,
  ScanEye,
  Smartphone,
  WifiOff,
} from "lucide-react";

/** Outline icons for names that aren't brands. Adding one here is the only edit needed. */
export const GENERIC = {
  database: Database,
  lock: Lock,
  "wifi-off": WifiOff,
  "scan-eye": ScanEye,
  "brain-circuit": BrainCircuit,
  message: MessageSquareText,
  languages: Languages,
  pickaxe: Pickaxe,
  monitor: Monitor,
  smartphone: Smartphone,
  flask: FlaskConical,
  "clipboard-check": ClipboardCheck,
  eye: Eye,
  bot: Bot,
  terminal: SquareTerminal,
  clapperboard: Clapperboard,
  film: Film,
} as const;
export type GenericIcon = keyof typeof GENERIC;

export type LogoSpec =
  /** From @iconify-json/logos (CC0 drawings of brand marks). `darkInvert`: black mark, shown white in dark mode. */
  | { iconify: string; darkInvert?: boolean }
  /**
   * A file in public/ (source in public/logos/SOURCES.md). `wordmark`: the logo spells the name,
   * so it counts as logo + name (ADR 0006) and stands alone; it sits on a light plate in dark mode.
   */
  | { file: string; wordmark?: boolean }
  /** Not a brand (a concept or a language): a lucide outline icon. */
  | { generic: GenericIcon };

const i = (iconify: string, darkInvert = false): LogoSpec => ({ iconify, darkInvert });
const g = (generic: GenericIcon): LogoSpec => ({ generic });

/** Keys are matched case-insensitively and without a trailing "(qualifier)". */
export const LOGOS: Record<string, LogoSpec> = {
  // Languages & frameworks
  Python: i("python"),
  TypeScript: i("typescript-icon"),
  SQL: g("database"),
  Java: i("java"),
  C: i("c"),
  React: i("react"),
  "Next.js": i("nextjs-icon"),
  SvelteKit: i("svelte-icon"),
  Hono: i("hono"),
  "Tailwind CSS": i("tailwindcss-icon"),
  // Testing
  pytest: { file: "/logos/tech/pytest.svg" },
  Vitest: i("vitest"),
  Playwright: i("playwright"),
  "unit & integration testing": g("flask"),
  "manual QA": g("clipboard-check"),
  // Cloud & data
  "Cloudflare Workers": i("cloudflare-workers-icon"),
  "Cloudflare D1": i("cloudflare-icon"),
  "Cloudflare Workers, D1 & KV": i("cloudflare-icon"),
  Supabase: i("supabase-icon"),
  "Drizzle ORM": i("drizzle-icon"),
  "GitHub Actions": i("github-actions"),
  Vercel: i("vercel-icon", true),
  SheetJS: { file: "/logos/tech/sheetjs.svg" },
  // AI
  Claude: i("claude-icon"),
  ChatGPT: i("openai-icon", true),
  Gemini: i("google-gemini-icon"),
  "prompt engineering": g("message"),
  "explainable AI": g("eye"),
  NLP: g("languages"),
  LLMs: g("brain-circuit"),
  "computer vision": g("scan-eye"),
  "AI-assisted development": g("bot"),
  "data mining": g("pickaxe"),
  // Tools
  Workday: { file: "/logos/tech/workday.svg", wordmark: true },
  "Git & GitHub": i("git-icon"),
  GitHub: i("github-icon", true),
  WordPress: i("wordpress-icon"),
  "MS Office": { file: "/logos/tech/microsoft-365.svg" },
  // Tools I use (homepage strip)
  "Claude Code": i("claude-icon"),
  "VS Code": i("visual-studio-code"),
  Obsidian: i("obsidian-icon"),
  Vite: i("vite-icon"),
  "Node.js": i("nodejs-icon"),
  "Git Bash": i("bash-icon", true),
  PowerShell: g("terminal"), // no PowerShell logo in the Iconify set
  Remotion: g("clapperboard"), // no Remotion logo in the Iconify set
  HyperFrames: g("film"), // no HyperFrames logo in the Iconify set
  ElevenLabs: i("elevenlabs-icon", true),
  // Concepts on project tags
  "AES-GCM": g("lock"),
  "offline PWA": g("wifi-off"),
  // Spoken languages & hero
  English: g("languages"),
  Filipino: g("languages"),
  web: g("monitor"),
  mobile: g("smartphone"),
};

/** "Workday (HRIS)" → "Workday": the name shown next to (or spelled by) the logo. */
export const displayName = (name: string) => name.replace(/\s*\(.*\)$/, "");

const BY_KEY = new Map(Object.entries(LOGOS).map(([k, v]) => [k.toLowerCase(), v]));

/** The logo for a name, or undefined. Tries the exact name, then without a "(qualifier)", ignoring case. */
export function logoFor(name: string): LogoSpec | undefined {
  return BY_KEY.get(name.toLowerCase()) ?? BY_KEY.get(displayName(name).toLowerCase());
}

/** Like logoFor, but a missing logo is a bug: fail loudly so the build catches it. */
export function requireLogo(name: string): LogoSpec {
  const spec = logoFor(name);
  if (!spec) throw new Error(`No logo for "${name}": add it to LOGOS in src/lib/logos.ts`);
  return spec;
}

type IconData = { body: string; width?: number; height?: number };
type IconSet = { icons: Record<string, IconData>; aliases?: Record<string, { parent: string }>; width?: number; height?: number };
const set = icons as IconSet;

/** SVG body + viewBox for an Iconify id (follows aliases). */
export function iconifySvg(id: string): { body: string; viewBox: string } {
  const data = set.icons[id] ?? set.icons[set.aliases?.[id]?.parent ?? ""];
  if (!data) throw new Error(`Unknown Iconify logo "${id}"`);
  return { body: data.body, viewBox: `0 0 ${data.width ?? set.width ?? 256} ${data.height ?? set.height ?? 256}` };
}

/**
 * Iconify bodies carry fixed ids (gradients, masks). Two copies of one logo on a page would share
 * them: invalid HTML, and gradients can break. Prefix every id and every reference to it.
 */
export function prefixSvgIds(body: string, prefix: string): string {
  return body
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/(href)="#([^"]+)"/g, `$1="#${prefix}-$2"`);
}
