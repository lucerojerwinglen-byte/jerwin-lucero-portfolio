import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Jerwin Lucero",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Blog
      </h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <p className="text-xs text-muted">{post.date}</p>
            <h2 className="mt-1 font-medium">{post.title}</h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
