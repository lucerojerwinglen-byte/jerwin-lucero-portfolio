import { site } from "@/content/data/site";

// Server-only: reads the public contribution calendar from GitHub's GraphQL API once a day.

export interface Contributions {
  total: number;
  /** One entry per day, oldest first, grouped into weeks of up to 7 days (Sunday first). */
  weeks: { date: string; count: number }[][];
}

const githubLogin = new URL(site.social.github).pathname.replace(/^\//, "");

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
}`;

type Day = { contributionCount: number; date: string };

/** Null when no token is configured or GitHub can't be reached; the error is logged, not hidden. */
export async function getContributions(): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login: githubLogin } }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) throw new Error(`GitHub API: ${JSON.stringify(json?.errors ?? json).slice(0, 200)}`);
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w: { contributionDays: Day[] }) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      ),
    };
  } catch (err) {
    console.error("[github] contributions unavailable:", err);
    return null;
  }
}
