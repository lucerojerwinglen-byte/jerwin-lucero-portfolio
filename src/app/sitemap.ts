import type { MetadataRoute } from "next";
import { site } from "@/content/data/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/blog`, lastModified: new Date() },
    ...posts,
  ];
}
