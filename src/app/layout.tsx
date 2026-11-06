import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/content/data/site";
import { DISPLAY_BOOT_SCRIPT } from "@/lib/home/display";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const title = site.shortName; // the tab and link previews say just the name; the description carries the rest

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.shortName}` },
  description: site.tagline,
  openGraph: { title, description: site.tagline, url: site.url, siteName: site.shortName, type: "profile" },
  twitter: { card: "summary_large_image", title, description: site.tagline },
};

export default function RootLayout({ children, sheet }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-notes="on"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} ${GeistPixelSquare.variable}`}
    >
      <body>
        {/* Accessibility panel settings (ADR 0007), applied before first paint: no flash of the default size. */}
        <script dangerouslySetInnerHTML={{ __html: DISPLAY_BOOT_SCRIPT }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {/* Project sheet slot (ADR 0007): a case study over the page when a project link is clicked. */}
          {sheet}
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
