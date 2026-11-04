import {
  siClaude,
  siCloudflare,
  siGithubactions,
  siNextdotjs,
  siPostgresql,
  siPytest,
  siPython,
  siReact,
  siSupabase,
  siSvelte,
  siTypescript,
  siVitest,
  type SimpleIcon,
} from "simple-icons";

// simple-icons has no Playwright or Workday logo, so those stay text-only.
const tools: { name: string; icon?: SimpleIcon }[] = [
  { name: "Python", icon: siPython },
  { name: "TypeScript", icon: siTypescript },
  { name: "SQL", icon: siPostgresql },
  { name: "pytest", icon: siPytest },
  { name: "Playwright" },
  { name: "Vitest", icon: siVitest },
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "SvelteKit", icon: siSvelte },
  { name: "Cloudflare", icon: siCloudflare },
  { name: "Supabase", icon: siSupabase },
  { name: "GitHub Actions", icon: siGithubactions },
  { name: "Workday" },
  { name: "Claude Code", icon: siClaude },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {tools.map((t) => (
        <li
          key={t.name}
          className="flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium whitespace-nowrap text-gray-600"
        >
          {t.icon && (
            <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d={t.icon.path} />
            </svg>
          )}
          {t.name}
        </li>
      ))}
    </ul>
  );
}

export function ToolStrip() {
  return (
    <div className="mt-10 flex items-stretch overflow-hidden border-y border-gray-200">
      <p className="flex shrink-0 items-center pr-4 text-[13px] text-gray-500 sm:pr-6">
        Tools I work with
      </p>
      <div className="marquee min-w-0 flex-1 overflow-hidden">
        {/* Two identical rows slide left by half their width, so the loop is seamless. */}
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
