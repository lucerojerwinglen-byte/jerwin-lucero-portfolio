import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { soonPages } from "@/content/home/home";
import { Sidebar } from "@/components/home/Sidebar";
import { Overlays } from "@/components/home/Overlays";
import { searchItems } from "@/lib/home/search-items";

// Sidebar pages that don't have content yet (ADR 0005). Only these slugs exist; anything
// else is a real 404, so this route can't swallow typos.
export const dynamicParams = false;
export const generateStaticParams = () => soonPages.map((p) => ({ soon: p.slug }));

type Props = { params: Promise<{ soon: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { soon } = await params;
  const page = soonPages.find((p) => p.slug === soon);
  return { title: page ? `${page.title} · coming soon` : "Not found", robots: { index: false } };
}

export default async function SoonPage({ params }: Props) {
  const { soon } = await params;
  const page = soonPages.find((p) => p.slug === soon);
  if (!page) notFound();
  return (
    <div className="home">
      <Sidebar onHome={false} />
      <main className="main">
        <div className="col soon">
          <div>
            <p className="caps">coming soon</p>
            <h1>{page.title}</h1>
            <p style={{ marginTop: 14 }}>Nothing here yet. It’s on the list.</p>
            <p style={{ marginTop: 18 }}>
              <Link href="/" className="mono" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                ← back home
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Overlays items={searchItems("/")} />
    </div>
  );
}
