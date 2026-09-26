export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { api, Project, Profile } from "@/lib/api";
import { Navbar, ProjectsSection, ContactSection } from "@/components/organisms";
import { Button, BackButton, SectionHeader } from "@/components/atoms";
import { defaultPortfolioData } from "@/data/portfolioData";
import { PortfolioProject, PortfolioProfile } from "@/types/portfolio";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  return {
    title: `Featured Projects & Case Studies | Eriko Syah Putra`,
    description:
      "Kumpulan proyek rekayasa perangkat lunak, sistem web full-stack, dan perancangan UI/UX oleh Eriko Syah Putra.",
  };
}

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

function resolveImg(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  const fullUrl =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `${BACKEND}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (fullUrl.includes("ik.imagekit.io") && !fullUrl.includes("tr=")) {
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}tr=w-800,q-80,f-auto`;
  }
  return fullUrl;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang =
    typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "id";

  let projectsData: Project[] = [];
  let profileData: Profile | null = null;

  try {
    const [projRes, profRes] = await Promise.allSettled([
      api.getProjects(lang),
      api.getProfile(lang),
    ]);
    if (projRes.status === "fulfilled") projectsData = projRes.value;
    if (profRes.status === "fulfilled") profileData = profRes.value;
  } catch (err) {
    console.warn("Could not fetch projects from backend:", err);
  }

  const mappedProfile: PortfolioProfile = {
    ...defaultPortfolioData.profile,
    name: profileData?.name || defaultPortfolioData.profile.name,
    title: profileData?.title || defaultPortfolioData.profile.title,
    avatarUrl: resolveImg(profileData?.avatarUrl) || defaultPortfolioData.profile.avatarUrl,
    email: profileData?.email || defaultPortfolioData.profile.email,
    githubUrl: profileData?.githubUrl || defaultPortfolioData.profile.githubUrl,
    linkedinUrl: profileData?.linkedinUrl || defaultPortfolioData.profile.linkedinUrl,
  };

  const mappedProjects: PortfolioProject[] =
    projectsData && projectsData.length > 0
      ? projectsData.map((p, idx) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category?.trim() ? p.category.trim() : "Full-Stack Development",
          tags:
            Array.isArray(p.technologies) && p.technologies.length > 0
              ? p.technologies
              : ["Web"],
          imageUrl:
            resolveImg(p.imageUrl) ||
            defaultPortfolioData.projects[idx % defaultPortfolioData.projects.length]?.imageUrl ||
            defaultPortfolioData.projects[0].imageUrl,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
          featured: Boolean(p.featured),
        }))
      : defaultPortfolioData.projects;

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-grid-canvas text-[#121214] font-sans antialiased relative selection:bg-[#FF462E] selection:text-white overflow-x-clip">
      {/* Sticky Modern Navbar */}
      <Navbar profile={mappedProfile} />

      <main className="pt-8 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-8 flex items-center justify-between">
            <BackButton
              href="/"
              label={lang === "en" ? "Back to Home" : "Kembali ke Beranda"}
              sublabel={lang === "en" ? "Navigation" : "Navigasi"}
            />
          </div>

          <div className="mb-12">
            <SectionHeader
              eyebrow="— Portfolio Directory"
              title={
                <>
                  All Works & <span className="text-[#FF462E]">Projects</span>
                </>
              }
              description="Jelajahi seluruh karya, prototipe aplikasi, dan studi kasus sistem yang pernah saya bangun."
            />
          </div>

          {/* Full Projects Section with Category Filtering */}
          <ProjectsSection projects={mappedProjects} />
        </div>
      </main>

      {/* Global Contact Section */}
      <ContactSection profile={mappedProfile} />
    </div>
  );
}
