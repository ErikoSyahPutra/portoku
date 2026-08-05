export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  HiOutlineGlobeAlt,
  HiOutlineCodeBracket,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";

function getAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://erikosyah.my.id${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata(
  { params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = typeof resolvedSearchParams.lang === "string" ? resolvedSearchParams.lang : "id";

  try {
    const project = await api.getProject(Number(id), lang);
    if (!project) return {};

    const ogImage = getAbsoluteImageUrl(project.imageUrl);

    return {
      title: `${project.title} | Projects`,
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
      alternates: {
        canonical: `https://erikosyah.my.id/projects/${id}`,
        languages: {
          "id-ID": `https://erikosyah.my.id/projects/${id}?lang=id`,
          "en-US": `https://erikosyah.my.id/projects/${id}?lang=en`,
        },
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
  const lang = typeof resolvedSearchParams.lang === "string" ? resolvedSearchParams.lang : "id";

  let project;
  try {
    project = await api.getProject(Number(id), lang);
  } catch {
    notFound();
  }
  if (!project) notFound();

  const BACKEND = "http://localhost:3001";
  const pImg = project.imageUrl
    ? project.imageUrl.startsWith("http") ? project.imageUrl : `${BACKEND}${project.imageUrl}`
    : null;

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

  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIdx = 0;
    
    // Regex matching either **bold**, *italic*, or [text](url)
    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|\[(.*?)\]\((.*?)\))/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      
      if (matchIndex > currentIdx) {
        parts.push(text.substring(currentIdx, matchIndex));
      }
      
      if (match[0].startsWith("**")) {
        parts.push(<strong key={matchIndex} style={{ color: "var(--text-primary)", fontWeight: 600 }}>{match[2]}</strong>);
      } else if (match[0].startsWith("*")) {
        parts.push(<em key={matchIndex} style={{ fontStyle: "italic" }}>{match[3]}</em>);
      } else {
        parts.push(
          <a
            key={matchIndex}
            href={match[5]}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--color-primary, #3b82f6)", textDecoration: "underline" }}
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

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Check block-level image
      const imgMatch = line.match(/^\s*!\[(.*?)\]\((.*?)\)\s*$/);
      if (imgMatch) {
        return (
          <div key={i} style={{ margin: "24px 0", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", padding: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgMatch[2]} alt={imgMatch[1] || "Project Image"} style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto", borderRadius: 8 }} />
          </div>
        );
      }

      if (line.startsWith("### ")) return <h3 key={i} style={{ marginTop: 24, marginBottom: 12, color: "var(--text-primary)" }}>{parseInlineMarkdown(line.slice(4))}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} style={{ marginTop: 32, marginBottom: 16, color: "var(--text-primary)" }}>{parseInlineMarkdown(line.slice(3))}</h2>;
      if (line.startsWith("# ")) return <h1 key={i} style={{ marginTop: 40, marginBottom: 20, color: "var(--text-primary)" }}>{parseInlineMarkdown(line.slice(2))}</h1>;
      if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} style={{ marginLeft: 16, marginBottom: 8 }}>{parseInlineMarkdown(line.slice(2))}</li>;
      if (line.match(/^\d+\.\s/)) return <li key={i} style={{ marginLeft: 16, marginBottom: 8 }}>{parseInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</li>;
      if (line.startsWith("```")) return null;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} style={{ marginBottom: 16 }}>{parseInlineMarkdown(line)}</p>;
    });
  };

  return (
    <div className="project-detail">
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
              name: "Eriko Syah Putra Friyadi",
              url: "https://erikosyah.my.id",
            },
          }),
        }}
      />
      <div className="container">
        <div className="project-detail-content">
          <Link href={`/?lang=${lang}#projects`} className="btn btn-secondary" style={{ marginBottom: 32, padding: "8px 16px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
            {lang === "en" ? "← Back to Projects" : "← Kembali ke Proyek"}
          </Link>
          
          <div className="project-detail-header" style={{ marginBottom: 40 }}>
            <h1 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: 16 }}>{project.title}</h1>
            <div className="project-techs" style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.technologies?.map((t) => (
                <span className="tech-tag" key={t} style={{ fontSize: "0.85rem" }}>{t}</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {project.liveUrl && (
                <a href={formatUrl(project.liveUrl)} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <HiOutlineGlobeAlt size={16} /> {lang === "en" ? "Live Demo" : "Demo Langsung"}
                </a>
              )}
              {project.githubUrl && (
                <a href={formatUrl(project.githubUrl)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <HiOutlineCodeBracket size={16} /> {lang === "en" ? "Source Code" : "Kode Sumber"}
                </a>
              )}
            </div>
          </div>

          {pImg ? (
            <div style={{ width: "100%", maxHeight: "500px", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-color)", marginBottom: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pImg} alt={project.title} style={{ width: "100%", height: "100%", maxHeight: "500px", objectFit: "cover", display: "block" }} />
            </div>
          ) : (
            <div style={{ width: "100%", height: "300px", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", border: "1px solid var(--border-color)", color: "var(--accent-secondary)", marginBottom: 40 }}>
              <HiOutlineComputerDesktop size={64} />
            </div>
          )}

          <div style={{ fontSize: "1.1rem", lineHeight: "1.75", color: "var(--text-secondary)" }}>
            {project.content ? (
              renderContent(project.content)
            ) : (
              <p>{project.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
