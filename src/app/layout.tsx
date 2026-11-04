import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/content/data/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const title = `${site.shortName} — Résumé · ${site.focus}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.shortName}` },
  description: site.tagline,
  openGraph: { title, description: site.tagline, url: site.url, siteName: site.shortName, type: "profile" },
  twitter: { card: "summary_large_image", title, description: site.tagline },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-notes="on"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--page)",
                color: "var(--ink)",
                border: "1px solid var(--rule)",
                fontFamily: "var(--body)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
