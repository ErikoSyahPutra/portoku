export const dynamic = "force-dynamic";

import React from "react";
import {
  api,
  Profile,
  Project,
  Experience,
  Academic,
  Blog,
  Award,
  Organization,
} from "@/lib/api";
import { PortfolioTemplate } from "@/components/templates";
import { defaultPortfolioData } from "@/data/portfolioData";
import {
  PortfolioProfile,
  PortfolioProject,
  PortfolioExperience,
  PortfolioAcademic,
  PortfolioBlog,
  formatProjectCategory,
} from "@/types/portfolio";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

function resolveImgUrl(url?: string | null): string {
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams?.lang || "id";

  let profileData: Profile | null = null;
  let projectsData: Project[] = [];
  let experiencesData: Experience[] = [];
  let academicsData: Academic[] = [];
  let blogsData: Blog[] = [];
  let awardsData: Award[] = [];
  let organizationsData: Organization[] = [];

  try {
    const [
      profileRes,
      projectsRes,
      experiencesRes,
      academicsRes,
      blogsRes,
      awardsRes,
      organizationsRes,
    ] = await Promise.allSettled([
      api.getProfile(lang),
      api.getProjects(lang),
      api.getExperiences(lang),
      api.getAcademics(lang),
      api.getBlogs(lang),
      api.getAwards(lang),
      api.getOrganizations(lang),
    ]);

    if (profileRes.status === "fulfilled") profileData = profileRes.value;
    if (projectsRes.status === "fulfilled") projectsData = projectsRes.value;
    if (experiencesRes.status === "fulfilled") experiencesData = experiencesRes.value;
    if (academicsRes.status === "fulfilled") academicsData = academicsRes.value;
    if (blogsRes.status === "fulfilled") blogsData = blogsRes.value;
    if (awardsRes.status === "fulfilled") awardsData = awardsRes.value;
    if (organizationsRes.status === "fulfilled") organizationsData = organizationsRes.value;
  } catch (err) {
    console.warn(
      "Backend API unavailable or error fetching data, using default portfolio data:",
      err
    );
  }

  // Map profile with live API data from NestJS / Admin, falling back gracefully to rich defaults
  const mappedProfile: PortfolioProfile = {
    name: profileData?.name?.trim() || defaultPortfolioData.profile.name,
    title: profileData?.title?.trim() || defaultPortfolioData.profile.title,
    bio: profileData?.bio?.trim() || defaultPortfolioData.profile.bio,
    aboutMe: profileData?.aboutMe?.trim() || defaultPortfolioData.profile.aboutMe,
    avatarUrl:
      resolveImgUrl(profileData?.avatarUrl) || defaultPortfolioData.profile.avatarUrl,
    location: profileData?.location?.trim() || defaultPortfolioData.profile.location,
    email: profileData?.email?.trim() || defaultPortfolioData.profile.email,
    githubUrl:
      profileData?.githubUrl?.trim() || defaultPortfolioData.profile.githubUrl,
    linkedinUrl:
      profileData?.linkedinUrl?.trim() || defaultPortfolioData.profile.linkedinUrl,
    websiteUrl:
      profileData?.websiteUrl?.trim() || defaultPortfolioData.profile.websiteUrl,
    availableBadge: defaultPortfolioData.profile.availableBadge,
    ratingScore: defaultPortfolioData.profile.ratingScore,
    reviewsCount: defaultPortfolioData.profile.reviewsCount,
    reviewsLabel: defaultPortfolioData.profile.reviewsLabel,
    quote: defaultPortfolioData.profile.quote,
    stats: {
      projects:
        projectsData.length > 0
          ? projectsData.length
          : defaultPortfolioData.profile.stats.projects,
      yearsExp:
        experiencesData.length > 0
          ? experiencesData.length
          : defaultPortfolioData.profile.stats.yearsExp,
      awards:
        awardsData.length > 0
          ? awardsData.length
          : defaultPortfolioData.profile.stats.awards,
      articles:
        blogsData.length > 0
          ? blogsData.length
          : defaultPortfolioData.profile.stats.articles,
      organizations:
        organizationsData.length > 0
          ? organizationsData.length
          : defaultPortfolioData.profile.stats.organizations,
    },
    showBlog: profileData?.showBlog !== false,
  };

  // Map projects from NestJS / Admin, falling back gracefully to rich defaults
  const mappedProjects: PortfolioProject[] =
    projectsData && projectsData.length > 0
      ? projectsData.map((p, idx) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: formatProjectCategory(p.category),
          tags:
            Array.isArray(p.technologies) && p.technologies.length > 0
              ? p.technologies
              : ["Web"],
          imageUrl:
            resolveImgUrl(p.imageUrl) ||
            defaultPortfolioData.projects.find(
              (dp) => dp.title.toLowerCase().trim() === p.title.toLowerCase().trim()
            )?.imageUrl ||
            defaultPortfolioData.projects[idx % defaultPortfolioData.projects.length]
              ?.imageUrl ||
            defaultPortfolioData.projects[0].imageUrl,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
          featured: Boolean(p.featured),
        }))
      : defaultPortfolioData.projects;

  // Map experiences from NestJS / Admin, falling back gracefully to rich defaults
  const mappedExperiences: PortfolioExperience[] =
    experiencesData && experiencesData.length > 0
      ? experiencesData.map((e) => ({
          id: e.id,
          company: e.company,
          position: e.position,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          current: e.current,
          description: e.description || "",
          skills: e.skills || [],
          logoUrl: resolveImgUrl(e.logoUrl),
        }))
      : defaultPortfolioData.experiences || [];

  // Map academics from NestJS / Admin, falling back gracefully to rich defaults
  const mappedAcademics: PortfolioAcademic[] =
    academicsData && academicsData.length > 0
      ? academicsData.map((a) => ({
          id: a.id,
          institution: a.institution,
          degree: a.degree,
          field: a.field,
          startYear: a.startYear,
          endYear: a.endYear,
          gpa: a.gpa,
          description: a.description,
          logoUrl: resolveImgUrl(a.logoUrl),
        }))
      : defaultPortfolioData.academics || [];

  // Map blogs from NestJS / Admin, falling back gracefully
  const mappedBlogs: PortfolioBlog[] =
    blogsData && blogsData.length > 0
      ? blogsData.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          coverImageUrl: resolveImgUrl(b.coverImageUrl),
          tags: Array.isArray(b.tags) ? b.tags : [],
          readTime: b.readTime || 5,
          createdAt: b.createdAt,
        }))
      : [];

  // JSON-LD structured data for SEO and search crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: mappedProfile.name,
    url: mappedProfile.websiteUrl || "https://erikosyah.my.id",
    jobTitle: mappedProfile.title,
    description: mappedProfile.bio,
    image: mappedProfile.avatarUrl,
    sameAs: [
      mappedProfile.githubUrl,
      mappedProfile.linkedinUrl,
      mappedProfile.websiteUrl,
    ].filter(Boolean),
    worksFor:
      experiencesData && experiencesData.length > 0
        ? experiencesData.map((e) => ({
            "@type": "Organization",
            name: e.company,
            jobTitle: e.position,
          }))
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <PortfolioTemplate
        profile={mappedProfile}
        projects={mappedProjects}
        services={defaultPortfolioData.services}
        reviews={defaultPortfolioData.reviews}
        heroSkills={defaultPortfolioData.heroSkills}
        marqueeItems={defaultPortfolioData.marqueeItems}
        experiences={mappedExperiences}
        academics={mappedAcademics}
        blogs={mappedBlogs}
        lang={lang}
      />
    </>
  );
}
