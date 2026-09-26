export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { api } from "@/lib/api";
import { Navbar, ContactSection } from "@/components/organisms";
import { Badge, Button, BackButton } from "@/components/atoms";
import { defaultPortfolioData } from "@/data/portfolioData";

function getAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://erikosyah.my.id${url.startsWith("/") ? "" : "/"}${url}`;
}

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

function resolveImg(url?: string) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BACKEND}${url}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  try {
    const blog = await api.getBlog(slug, lang);
    if (!blog) return {};

    const ogImage = getAbsoluteImageUrl(blog.coverImageUrl);

    return {
      title: `${blog.title} | Eriko Syah Putra`,
      description: blog.excerpt || blog.content.substring(0, 160),
      keywords: blog.tags?.join(", "),
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.content.substring(0, 160),
        type: "article",
        url: `https://erikosyah.my.id/blog/${slug}`,
        images: ogImage ? [{ url: ogImage, alt: blog.title }] : [],
        publishedTime: new Date(blog.createdAt).toISOString(),
        authors: ["Eriko Syah Putra"],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt || blog.content.substring(0, 160),
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  let blog;
  let profile = defaultPortfolioData.profile;

  try {
    const [blogRes, profileRes] = await Promise.allSettled([
      api.getBlog(slug, lang),
      api.getProfile(lang),
    ]);

    if (blogRes.status === "fulfilled") blog = blogRes.value;
    if (profileRes.status === "fulfilled" && profileRes.value) {
      profile = {
        ...defaultPortfolioData.profile,
        name: profileRes.value.name || defaultPortfolioData.profile.name,
        title: profileRes.value.title || defaultPortfolioData.profile.title,
        bio: profileRes.value.bio || defaultPortfolioData.profile.bio,
        avatarUrl:
          resolveImg(profileRes.value.avatarUrl) ||
          defaultPortfolioData.profile.avatarUrl,
        email: profileRes.value.email || defaultPortfolioData.profile.email,
        githubUrl:
          profileRes.value.githubUrl || defaultPortfolioData.profile.githubUrl,
        linkedinUrl:
          profileRes.value.linkedinUrl ||
          defaultPortfolioData.profile.linkedinUrl,
      };
    }
  } catch {
    notFound();
  }

  if (!blog) notFound();

  const coverImg = resolveImg(blog.coverImageUrl);

  // Markdown Parser
  const parseInline = (text: string) => {
    // Regex for bold **text**, code `text`, and links [label](url)
    const regex = /(\*\*(.*?)\*\*|`(.*?)`|\[(.*?)\]\((.*?)\))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[0].startsWith("**")) {
        parts.push(
          <strong key={match.index} className="font-bold text-[#121214]">
            {match[2]}
          </strong>
        );
      } else if (match[0].startsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="bg-[#0F0F11]/10 text-[#FF462E] font-mono px-1.5 py-0.5 rounded text-xs sm:text-sm font-semibold"
          >
            {match[3]}
          </code>
        );
      } else if (match[0].startsWith("[")) {
        parts.push(
          <a
            key={match.index}
            href={match[5]}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF462E] hover:underline font-semibold"
          >
            {match[4]}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${i}`}
              className="bg-[#0F0F11] text-[#E0E0E6] p-5 sm:p-6 rounded-2xl overflow-x-auto my-6 text-xs sm:text-sm font-mono border border-white/10 shadow-lg"
            >
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={i}
            className="text-lg sm:text-xl font-bold text-[#121214] mt-8 mb-3 tracking-tight flex items-center gap-2"
          >
            <span className="w-1.5 h-4 bg-[#FF462E] rounded-full inline-block" />
            {parseInline(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#121214] mt-10 mb-4 tracking-tight"
          >
            {parseInline(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={i}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#121214] mt-12 mb-5 tracking-tight"
          >
            {parseInline(line.slice(2))}
          </h1>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-2.5 pl-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF462E] flex-shrink-0 mt-1" />
            <span>{parseInline(line.slice(2))}</span>
          </li>
        );
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-2.5 pl-2"
          >
            <span className="w-5 h-5 rounded-full bg-[#FFF1EE] text-[#FF462E] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span>{parseInline(line.replace(/^\d+\.\s/, ""))}</span>
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-4" />);
      } else {
        elements.push(
          <p
            key={i}
            className="text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-5"
          >
            {parseInline(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(
    lang === "en" ? "en-US" : "id-ID",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-grid-canvas text-[#121214] font-sans antialiased relative selection:bg-[#FF462E] selection:text-white overflow-x-clip">
      {/* Sticky Modern Navbar */}
      <Navbar profile={profile} />

      {/* Structured SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.excerpt || blog.content.substring(0, 160),
            image: getAbsoluteImageUrl(blog.coverImageUrl),
            datePublished: new Date(blog.createdAt).toISOString(),
            author: {
              "@type": "Person",
              name: profile.name,
              url: "https://erikosyah.my.id",
            },
          }),
        }}
      />

      <main className="pt-8 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation Button */}
          <div className="mb-8 flex items-center justify-between">
            <BackButton
              href="/#blog"
              label={lang === "en" ? "Back to Articles" : "Kembali ke Artikel"}
            />
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ECE8DF] text-xs font-medium text-[#888899] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF462E] animate-pulse" />
              <span>{lang === "en" ? "Editorial Article" : "Artikel Editorial"}</span>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-10 max-w-4xl">
            {/* Tags Row */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="coral">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Article Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121214] tracking-tight leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#ECE8DF] text-xs sm:text-sm text-[#666672]">
              <div className="flex items-center gap-3">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#ECE8DF]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FF462E] text-white font-bold flex items-center justify-center">
                    ES
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#121214]">{profile.name}</div>
                  <div className="text-xs text-[#A0A0B8]">{profile.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF462E]" />
                  <span>{formattedDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#A0A0B8]" />
                  <span>
                    {blog.readTime || 5}{" "}
                    {lang === "en" ? "min read" : "menit baca"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Cover Image (Full Width Cinematic) */}
          {coverImg ? (
            <div className="w-full h-60 sm:h-[420px] lg:h-[540px] rounded-3xl overflow-hidden mb-12 border border-[#ECE8DF] shadow-xl bg-[#0F0F11]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImg}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-56 sm:h-80 rounded-3xl bg-gradient-to-br from-[#1A1A1E] to-[#0F0F11] border border-white/10 flex flex-col items-center justify-center text-center p-5 sm:p-6 mb-12 relative overflow-hidden shadow-xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FF462E]/20 border border-[#FF462E]/40 flex items-center justify-center text-[#FF462E] mb-3">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest">
                Technical Insight & Case Study
              </span>
            </div>
          )}

          {/* Article Layout Grid (8 Cols Article + 4 Cols Sticky Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
            {/* Main Article Body (8 Cols) */}
            <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm border border-[#ECE8DF] rounded-3xl p-5 sm:p-10 lg:p-12 shadow-sm">
              {renderContent(blog.content)}
            </div>

            {/* Sticky Sidebar (4 Cols) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Author Card */}
              <div className="bg-[#0F0F11] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF462E]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex items-start gap-4 mb-4">
                  {profile.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#FF462E] flex-shrink-0"
                    />
                  )}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#FF462E] font-bold">
                      Written by
                    </div>
                    <h4 className="text-lg font-bold">{profile.name}</h4>
                    <p className="text-xs text-[#A0A0B8]">{profile.title}</p>
                  </div>
                </div>
                <p className="relative z-10 text-xs sm:text-sm text-[#A0A0B8] leading-relaxed mb-5">
                  {profile.bio}
                </p>
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <Link
                    href="/#about"
                    className="font-semibold text-[#FF462E] hover:underline"
                  >
                    Tentang Penulis →
                  </Link>
                  <Link
                    href="/#contact"
                    className="font-semibold text-white/70 hover:text-white hover:underline"
                  >
                    Hubungi Saya →
                  </Link>
                </div>
              </div>

              {/* Quick Article Info & Share Card */}
              <div className="bg-white/90 border border-[#ECE8DF] rounded-3xl p-6 shadow-xs">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#888899] mb-3">
                  Informasi Artikel
                </h5>
                <div className="space-y-3 text-xs text-[#4A4A57]">
                  <div className="flex justify-between py-1.5 border-b border-[#ECE8DF]">
                    <span className="text-[#888899]">Dipublikasikan</span>
                    <span className="font-semibold text-[#121214]">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#ECE8DF]">
                    <span className="text-[#888899]">Estimasi Baca</span>
                    <span className="font-semibold text-[#121214]">{blog.readTime || 5} Menit</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#ECE8DF]">
                    <span className="text-[#888899]">Kategori</span>
                    <span className="font-semibold text-[#FF462E]">Engineering & Web</span>
                  </div>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-4 pt-3">
                    <span className="text-[11px] font-bold text-[#888899] block mb-2">
                      Topik Terkait:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-full bg-[#F5F2EB] text-[#4A4A57] text-[11px] font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Consultation / Work with me Card */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-[#FFF1EE] to-white border border-[#FF462E]/20 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF462E] block mb-1">
                  Kolaborasi & Konsultasi
                </span>
                <h5 className="text-sm font-bold text-[#121214] mb-2">
                  Punya proyek web yang ingin dibangun?
                </h5>
                <p className="text-xs text-[#666672] leading-relaxed mb-4">
                  Saya terbuka untuk kerja sama pengembangan aplikasi skala penuh maupun konsultasi arsitektur.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-[#FF462E] hover:bg-[#E63B24] text-white text-xs font-semibold shadow-xs transition-all"
                >
                  Mulai Diskusi Proyek
                </Link>
              </div>
            </aside>
          </div>

          {/* Bottom Navigation & Call to Action */}
          <div className="pt-6 border-t border-[#ECE8DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <BackButton
              href="/#blog"
              label={lang === "en" ? "Back to All Articles" : "Kembali ke Semua Artikel"}
            />
            <div className="flex items-center gap-3">
              <Button
                href="/#projects"
                variant="outline"
                size="sm"
              >
                {lang === "en" ? "Explore Case Studies" : "Eksplorasi Studi Kasus"}
              </Button>
              <Button
                href="/#contact"
                variant="primary"
                size="sm"
              >
                {lang === "en" ? "Get in Touch" : "Hubungi Saya"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Global Contact Section */}
      <ContactSection profile={profile} />
    </div>
  );
}
