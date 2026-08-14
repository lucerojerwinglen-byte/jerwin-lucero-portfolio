import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/content/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.shortName} — ${site.title}`,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CommandPalette />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
