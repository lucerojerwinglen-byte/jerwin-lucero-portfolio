import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { formatRevDate } from "@/lib/document/document";

export const metadata: Metadata = { title: "Writing" };

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <main className="article-wrap">
      <article className="sheet article">
        <Link className="back" href="/">
          <ArrowLeft className="ico" aria-hidden="true" />
          Back home
        </Link>
        <h1>Writing</h1>
        <ul className="posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <span>
                  <span className="t">{post.title}</span>
                  <span className="ex">{post.excerpt}</span>
                </span>
                <span className="meta">{formatRevDate(post.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
