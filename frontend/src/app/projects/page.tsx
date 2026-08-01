export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCodeBracket,
  HiOutlineComputerDesktop,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { translations } from "@/lib/translations";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = typeof resolvedSearchParams.lang === "string" ? resolvedSearchParams.lang : "id";
  const t = translations[lang] || translations.id;

  return {
    title: `${t.portfolio} | Eriko Syah Putra`,
    description: t.projectsSubtitle,
  };
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = typeof resolvedSearchParams.lang === "string" ? resolvedSearchParams.lang : "id";
  const t = translations[lang] || translations.id;

  let projects = [];
  try {
    projects = await api.getProjects(lang);
  } catch {
    projects = [];
  }

  const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";
  function img(url?: string): string | null {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${BACKEND}${url}`;
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

  return (
    <main style={{ minHeight: "80vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <Link
            href={`/?lang=${lang}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.9rem",
              color: "var(--accent-secondary)",
              textDecoration: "none",
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            <HiOutlineArrowLeft size={16} />
            {lang === "en" ? "Back to Home" : "Kembali ke Beranda"}
          </Link>
          <h1 className="section-title" style={{ fontSize: "2.2rem" }}>
            {t.portfolio}
          </h1>
          <p className="section-desc">{t.projectsSubtitle}</p>
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
            <HiOutlineComputerDesktop size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>{lang === "en" ? "No projects found." : "Belum ada proyek yang ditampilkan."}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => {
              const pImg = img(p.imageUrl);
              return (
                <div className="project-card" key={p.id} style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    href={`/projects/${p.id}?lang=${lang}`}
                    style={{ flex: 1, display: "block", color: "inherit", textDecoration: "none" }}
                  >
                    {pImg ? (
                      <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pImg} alt={p.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                      </div>
                    ) : (
                      <div style={{ marginBottom: 16, borderRadius: 8, height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", border: "1px solid var(--border-color)", color: "var(--accent-secondary)" }}>
                        <HiOutlineComputerDesktop size={44} />
                      </div>
                    )}
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 10 }}>{p.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 16, lineHeight: 1.6 }}>{p.description}</p>
                    <div className="project-techs" style={{ marginBottom: 16 }}>
                      {p.technologies?.map((tech) => (
                        <span className="tech-tag" key={tech}>{tech}</span>
                      ))}
                    </div>
                  </Link>

                  <div className="project-links" style={{ marginTop: "auto", paddingTop: 12 }}>
                    {p.liveUrl && (
                      <a href={formatUrl(p.liveUrl)} target="_blank" rel="noreferrer">
                        <HiOutlineArrowTopRightOnSquare size={14} /> {t.liveDemo}
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={formatUrl(p.githubUrl)} target="_blank" rel="noreferrer">
                        <HiOutlineCodeBracket size={14} /> {t.sourceCode}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
