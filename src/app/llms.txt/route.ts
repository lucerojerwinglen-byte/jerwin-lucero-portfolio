// /llms.txt (ADR 0007): generated from the content files at build time, like robots and sitemap.
import { llmsText } from "@/lib/home/profile";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(getAllPosts()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
