export const dynamic = "force-dynamic";

import ProjectGridWithFilter from "@/components/ProjectGridWithFilter";
import { Project, api } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";
import { HiOutlineArrowLeft } from "react-icons/hi2";
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

  let projects: Project[] = [];
  try {
    projects = await api.getProjects(lang);
  } catch {
    projects = [];
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

        <ProjectGridWithFilter projects={projects} lang={lang} />
      </div>
    </main>
  );
}
