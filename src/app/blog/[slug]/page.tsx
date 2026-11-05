import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatRevDate } from "@/lib/document/document";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="article-wrap">
      <article className="sheet article">
        <Link className="back" href="/">
          <ArrowLeft className="ico" aria-hidden="true" />
          Back home
        </Link>
        <p className="date">{formatRevDate(post.date)}</p>
        <h1>{post.title}</h1>
        <div className="prose max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
