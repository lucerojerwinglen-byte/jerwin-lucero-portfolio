export interface SearchItem {
  title: string;
  kind: "section" | "page" | "project" | "post" | "file" | "faq";
  href: string;
  keywords?: string;
}

/** Lower-case and strip accents, so "resume" finds "Résumé". */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Every word of the query must appear in the title or keywords. Title matches rank first; ties keep input order. */
export function search(items: SearchItem[], query: string): SearchItem[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  return items
    .map((item, i) => {
      const title = norm(item.title);
      const all = `${title} ${norm(item.keywords ?? "")}`;
      if (!words.every((w) => all.includes(w))) return null;
      return { item, i, rank: words.every((w) => title.includes(w)) ? 0 : 1 };
    })
    .filter((x) => x !== null)
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((x) => x.item);
}
