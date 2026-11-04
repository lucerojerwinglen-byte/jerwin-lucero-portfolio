import Link from "next/link";
import { ArrowRight, Globe, Mail } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { formatRevDate } from "@/lib/document/document";
import { site } from "@/content/data/site";
import { revision } from "@/components/doc/parts";
import { ReplyForm } from "./ReplyForm";
import { TypingTest } from "./TypingTest";

const monthYear = (iso: string) => formatRevDate(iso).replace(/^\d+ /, "");
/** "Draft — notes on…" → "Notes on…": the draft status is shown in the meta column instead. */
const cleanExcerpt = (s: string) => s.replace(/^Draft\s*[—-]\s*/, "").replace(/^./, (c) => c.toUpperCase());

/** The sheet after the résumé: things paper can't do. Never printed. */
export function WebSheet() {
  const posts = getAllPosts();
  return (
    <article className="sheet web" data-page="A" aria-label="Web-only appendix">
      <span className="webtag">
        <Globe className="ico" aria-hidden="true" />
        Web only · not part of the PDF
      </span>

      <section aria-labelledby="writing">
        <h2 id="writing">Writing</h2>
        <ul className="posts">
          {posts.map((p) => {
            const draft = p.excerpt.startsWith("Draft");
            return (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>
                  <span>
                    <span className="t">
                      {p.title}
                      <ArrowRight className="ico" aria-hidden="true" />
                    </span>
                    <span className="ex">{cleanExcerpt(p.excerpt)}</span>
                  </span>
                  <span className="meta">
                    {monthYear(p.date)}
                    {draft && " · draft"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Reply</h2>
        <p className="lede">
          Hiring for QA, data or AI? Send a note here, or write to{" "}
          <a href={`mailto:${site.email}`}>
            <Mail className="ico" aria-hidden="true" style={{ verticalAlign: "-2px", marginRight: 4 }} />
            {site.email}
          </a>
          .
        </p>
        <ReplyForm />
      </section>

      <section aria-labelledby="appendix-a">
        <h2 id="appendix-a">Appendix A — Typing test</h2>
        <TypingTest />
      </section>

      <p className="colophon">
        Colophon: set in Source Serif 4 and Geist. This page is the PDF: the download is printed from this exact
        document by a headless browser, and a test fails if the two ever drift apart. {revision}.
      </p>
    </article>
  );
}
