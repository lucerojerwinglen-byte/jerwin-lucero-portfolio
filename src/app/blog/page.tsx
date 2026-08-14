import Link from "next/link";
import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="reveal font-pixel text-sm text-gray-500">01 — blog</h1>
      <div className="mt-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border-t border-gray-200 py-5 first:border-t-0 first:pt-0"
          >
            <p className="flex items-center gap-1.5 font-mono text-[12px] text-gray-500">
              <Calendar className="h-3 w-3" />
              {post.date}
            </p>
            <h2 className="mt-1 font-medium text-ink">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
