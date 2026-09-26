export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Globe,
  Github,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Layers,
  Laptop,
} from "lucide-react";
import { api } from "@/lib/api";
import { Navbar, ContactSection } from "@/components/organisms";
import { Badge, Button, BackButton } from "@/components/atoms";
import { defaultPortfolioData } from "@/data/portfolioData";
import { formatProjectCategory } from "@/types/portfolio";

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

function formatUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  try {
    const project = await api.getProject(Number(id), lang);
    if (!project) return {};

    const ogImage = getAbsoluteImageUrl(project.imageUrl);

    return {
      title: `${project.title} | Eriko Syah Putra`,
      description: project.description,
      keywords: project.technologies?.join(", "),
      openGraph: {
        title: project.title,
        description: project.description,
        type: "website",
        url: `https://erikosyah.my.id/projects/${id}`,
        images: ogImage ? [{ url: ogImage, alt: project.title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProjectDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  let project;
  let profile = defaultPortfolioData.profile;

  try {
    const [projectRes, profileRes] = await Promise.allSettled([
      api.getProject(Number(id), lang),
      api.getProfile(lang),
    ]);

    if (projectRes.status === "fulfilled") project = projectRes.value;
    if (profileRes.status === "fulfilled" && profileRes.value) {
      profile = {
        ...defaultPortfolioData.profile,
        name: profileRes.value.name || defaultPortfolioData.profile.name,
        title: profileRes.value.title || defaultPortfolioData.profile.title,
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

  // Fallback to sample project from dummy data if not found in backend
  if (!project) {
    const fallbackProj = defaultPortfolioData.projects.find(
      (p) => String(p.id) === String(id)
    );
    if (fallbackProj) {
      project = {
        id: Number(fallbackProj.id),
        title: fallbackProj.title,
        description: fallbackProj.description,
        category: fallbackProj.category,
        technologies: fallbackProj.tags,
        imageUrl: fallbackProj.imageUrl,
        liveUrl: fallbackProj.liveUrl,
        githubUrl: fallbackProj.githubUrl,
        figmaUrl: undefined,
        behanceUrl: undefined,
        content: undefined,
        featured: fallbackProj.featured,
        order: 1,
      };
    } else {
      notFound();
    }
  }

  const pImg = resolveImg(project.imageUrl);

  // Markdown inline parser
  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIdx = 0;
    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|\[(.*?)\]\((.*?)\))/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;

      if (matchIndex > currentIdx) {
        parts.push(text.substring(currentIdx, matchIndex));
      }

      if (match[0].startsWith("**")) {
        parts.push(
          <strong key={matchIndex} className="font-bold text-[#121214]">
            {match[2]}
          </strong>
        );
      } else if (match[0].startsWith("*")) {
        parts.push(
          <em key={matchIndex} className="italic text-[#121214]">
            {match[3]}
          </em>
        );
      } else {
        parts.push(
          <a
            key={matchIndex}
            href={match[5]}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF462E] hover:underline font-semibold"
          >
            {match[4]}
          </a>
        );
      }

      currentIdx = regex.lastIndex;
    }

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const imgMatch = line.match(/^\s*!\[(.*?)\]\((.*?)\)\s*$/);
      if (imgMatch) {
        return (
          <div
            key={i}
            className="my-8 rounded-2xl overflow-hidden border border-[#ECE8DF] bg-[#0F0F11] p-2 shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgMatch[2]}
              alt={imgMatch[1] || "Project Image"}
              className="max-w-full h-auto mx-auto rounded-xl"
            />
          </div>
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-lg sm:text-xl font-bold text-[#121214] mt-8 mb-3 tracking-tight flex items-center gap-2"
          >
            <span className="w-1.5 h-4 bg-[#FF462E] rounded-full inline-block" />
            {parseInlineMarkdown(line.slice(4))}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="text-xl sm:text-2xl font-bold text-[#121214] mt-10 mb-4 tracking-tight"
          >
            {parseInlineMarkdown(line.slice(3))}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1
            key={i}
            className="text-2xl sm:text-3xl font-extrabold text-[#121214] mt-12 mb-5 tracking-tight"
          >
            {parseInlineMarkdown(line.slice(2))}
          </h1>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-2.5 pl-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF462E] mt-2 flex-shrink-0" />
            <span>{parseInlineMarkdown(line.slice(2))}</span>
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-2.5 pl-2"
          >
            <span className="w-5 h-5 rounded-full bg-[#FFF1EE] text-[#FF462E] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span>{parseInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</span>
          </li>
        );
      }
      if (line.startsWith("```")) return null;
      if (line.trim() === "") return <div key={i} className="h-4" />;
      return (
        <p
          key={i}
          className="text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-5"
        >
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

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
            "@type": "SoftwareApplication",
            name: project.title,
            description: project.description,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            image: getAbsoluteImageUrl(project.imageUrl),
            url: `https://erikosyah.my.id/projects/${id}`,
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
              href="/#projects"
              label={lang === "en" ? "Back to Projects" : "Kembali ke Proyek"}
              sublabel={lang === "en" ? "Portfolio" : "Koleksi Proyek"}
            />
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ECE8DF] text-xs font-medium text-[#888899] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF462E] animate-pulse" />
              <span>{lang === "en" ? "Featured Case Study" : "Studi Kasus Proyek"}</span>
            </div>
          </div>

          {/* Project Header */}
          <header className="mb-10">
            {/* Category Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>{formatProjectCategory(project.category)}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#121214] tracking-tight leading-tight mb-4">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#666672] leading-relaxed max-w-3xl mb-6">
              {project.description}
            </p>

            {/* Technologies Pills */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech: string, idx: number) => (
                  <Badge key={idx} variant="subtle">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Links Buttons */}
            <div className="flex flex-wrap gap-3.5 items-center">
              {project.liveUrl && (
                <Button
                  href={formatUrl(project.liveUrl)}
                  variant="primary"
                  icon={<Globe className="w-4 h-4" />}
                  size="md"
                >
                  {lang === "en" ? "Live Demo" : "Lihat Demo"}
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  href={formatUrl(project.githubUrl)}
                  variant="outline"
                  icon={<Github className="w-4 h-4" />}
                  size="md"
                >
                  {lang === "en" ? "Source Code" : "Lihat Kode"}
                </Button>
              )}

              {project.figmaUrl && (
                <Button
                  href={formatUrl(project.figmaUrl)}
                  variant="dark"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                  size="md"
                >
                  Figma Prototype
                </Button>
              )}
            </div>
          </header>

          {/* Project Featured Image / Mockup Display */}
          {pImg ? (
            <div className="w-full rounded-3xl overflow-hidden border border-[#ECE8DF] bg-white shadow-xl mb-12 relative group">
              {/* Browser-style Top Bar Header */}
              <div className="h-10 bg-[#F5F2EB] border-b border-[#ECE8DF] px-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-3 text-xs text-[#888899] font-mono truncate max-w-xs sm:max-w-md">
                  {project.liveUrl || `https://erikosyah.my.id/projects/${id}`}
                </span>
              </div>

              {/* Main Image */}
              <div className="max-h-[260px] sm:max-h-[440px] lg:max-h-[580px] overflow-hidden bg-[#0F0F11]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pImg}
                  alt={project.title}
                  className="w-full h-auto object-cover object-top"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-56 sm:h-72 rounded-3xl bg-[#0F0F11] border border-white/10 flex flex-col items-center justify-center text-white mb-12 shadow-lg">
              <Laptop className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF462E] mb-3" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Project Showcase Preview
              </span>
            </div>
          )}

          {/* Detailed Project Story / Case Study Content */}
          <div className="bg-white/95 backdrop-blur-sm border border-[#ECE8DF] rounded-3xl p-5 sm:p-10 lg:p-12 shadow-sm mb-12">
            <div className="border-b border-[#ECE8DF] pb-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#121214] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF462E]" />
                <span>Project Case Study & Overview</span>
              </h2>
            </div>

            {project.content ? (
              <div className="prose-container">{renderContent(project.content)}</div>
            ) : (
              <div className="space-y-4 text-base text-[#4A4A57] leading-relaxed">
                <p>{project.description}</p>
                <p>
                  Proyek ini dibangun dengan memadukan estetika UI/UX tingkat tinggi
                  serta arsitektur kode modern yang modular dan skalabel. Menawarkan
                  pengalaman interaktif yang intuitif, waktu respons cepat, serta
                  keamanan data yang andal.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Navigation & Call to Action */}
          <div className="pt-4 border-t border-[#ECE8DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <BackButton
              href="/#projects"
              label={lang === "en" ? "Back to All Projects" : "Kembali ke Semua Proyek"}
              sublabel={lang === "en" ? "Explore More" : "Eksplorasi Lainnya"}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/projects"
                variant="outline"
                size="sm"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                {lang === "en" ? "Browse Directory" : "Katalog Semua Proyek"}
              </Button>
              <Button
                href="/#contact"
                variant="primary"
                size="sm"
              >
                {lang === "en" ? "Discuss a Project" : "Konsultasi Proyek"}
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
