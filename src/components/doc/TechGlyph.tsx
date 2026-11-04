import {
  siCloudflare,
  siGithub,
  siGithubactions,
  siHono,
  siPython,
  siReact,
  siSvelte,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// Monochrome brand marks drawn in the text colour: never brand colours (one accent rule).
const GLYPHS: Record<string, SimpleIcon> = {
  SvelteKit: siSvelte,
  "Cloudflare Workers": siCloudflare,
  "Cloudflare D1": siCloudflare,
  TypeScript: siTypescript,
  React: siReact,
  "GitHub Actions": siGithubactions,
  Python: siPython,
  Hono: siHono,
  GitHub: siGithub,
};

export function TechGlyph({ name }: { name: string }) {
  const icon = GLYPHS[name];
  if (!icon) return null;
  return (
    <svg className="glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  return (
    <span className="tags">
      {tags.map((t) => (
        <span key={t} className="tag">
          <TechGlyph name={t} />
          {t}
        </span>
      ))}
    </span>
  );
}
