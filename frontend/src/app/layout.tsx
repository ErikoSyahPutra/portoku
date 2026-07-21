import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Eriko Syah Putra Friyadi | Full Stack Developer Portfolio",
  description: "Full Stack Developer — Crafting digital experiences with modern technologies. Explore my projects, experience, and blog.",
  keywords: "Eriko, Eriko Syah Putra, developer, full stack, portfolio, web development",
  authors: [{ name: "Eriko Syah Putra Friyadi" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description: "Full Stack Developer — Crafting digital experiences with modern technologies",
    type: "website",
    url: "https://erikosyah.my.id",
    siteName: "Eriko Syah Putra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description: "Full Stack Developer — Crafting digital experiences",
  },
  alternates: {
    canonical: "https://erikosyah.my.id",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="UdECNpWh12DvjPoSEmEWawHJDPYiiLK5ks2jguHO7gw" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.className = theme;
                } catch (e) {}
              })()
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Eriko Syah Putra Friyadi",
              url: "https://erikosyah.my.id",
              jobTitle: "Full Stack Developer",
              description: "Full Stack Developer crafting digital experiences with modern technologies",
              sameAs: [
                "https://github.com",
                "https://linkedin.com",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
