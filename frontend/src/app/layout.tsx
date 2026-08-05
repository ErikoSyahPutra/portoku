import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://erikosyah.my.id"),
  title: {
    default: "Eriko Syah Putra Friyadi | Full Stack Developer",
    template: "%s | Eriko Syah Putra",
  },
  description:
    "Full Stack Developer specializing in Web Development, Next.js, React, Node.js, and modern cloud technologies. View my portfolio, experience, and articles.",
  keywords: [
    "Eriko Syah Putra Friyadi",
    "Eriko Syah Putra",
    "Full Stack Developer",
    "Web Developer Indonesia",
    "React Developer",
    "Next.js Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: "Eriko Syah Putra Friyadi", url: "https://erikosyah.my.id" }],
  creator: "Eriko Syah Putra Friyadi",
  publisher: "Eriko Syah Putra Friyadi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description:
      "Full Stack Developer — Crafting digital experiences with modern web technologies.",
    url: "https://erikosyah.my.id",
    siteName: "Eriko Syah Putra Portfolio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description:
      "Full Stack Developer — Crafting digital experiences with modern web technologies.",
    creator: "@erikosyah",
  },
  alternates: {
    canonical: "https://erikosyah.my.id",
    languages: {
      "id-ID": "https://erikosyah.my.id?lang=id",
      "en-US": "https://erikosyah.my.id?lang=en",
    },
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
              alternateName: "Eriko Syah Putra",
              url: "https://erikosyah.my.id",
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer crafting high-performance digital experiences with Next.js, React, Node.js, and modern technologies.",
              sameAs: [
                "https://github.com",
                "https://linkedin.com",
              ],
              knowsAbout: [
                "Web Development",
                "Full Stack Development",
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "JavaScript",
                "REST API",
                "UI/UX Design",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
