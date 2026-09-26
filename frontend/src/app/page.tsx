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
  ensureExternalUrl,
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

function calculateYearsExp(experiences: Experience[]): number {
  if (!experiences || experiences.length === 0) return 0;
  let earliestYear = new Date().getFullYear();
  let hasValidDate = false;

  for (const exp of experiences) {
    if (exp.startDate) {
      const year = parseInt(exp.startDate.substring(0, 4), 10);
      if (!isNaN(year) && year >= 2000 && year <= new Date().getFullYear()) {
        earliestYear = Math.min(earliestYear, year);
        hasValidDate = true;
      }
    }
  }

  if (hasValidDate) {
    const currentYear = new Date().getFullYear();
    const diff = currentYear - earliestYear;
    return Math.max(diff > 0 ? diff : 1, Math.min(experiences.length, 3));
  }

  return experiences.length;
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

  let isProjectsLoaded = false;
  let isExperiencesLoaded = false;
  let isAcademicsLoaded = false;
  let isBlogsLoaded = false;
  let isAwardsLoaded = false;
  let isOrganizationsLoaded = false;

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
    if (projectsRes.status === "fulfilled") {
      projectsData = projectsRes.value;
      isProjectsLoaded = true;
    }
    if (experiencesRes.status === "fulfilled") {
      experiencesData = experiencesRes.value;
      isExperiencesLoaded = true;
    }
    if (academicsRes.status === "fulfilled") {
      academicsData = academicsRes.value;
      isAcademicsLoaded = true;
    }
    if (blogsRes.status === "fulfilled") {
      blogsData = blogsRes.value;
      isBlogsLoaded = true;
    }
    if (awardsRes.status === "fulfilled") {
      awardsData = awardsRes.value;
      isAwardsLoaded = true;
    }
    if (organizationsRes.status === "fulfilled") {
      organizationsData = organizationsRes.value;
      isOrganizationsLoaded = true;
    }
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
      ensureExternalUrl(profileData?.githubUrl?.trim()) || defaultPortfolioData.profile.githubUrl,
    linkedinUrl:
      ensureExternalUrl(profileData?.linkedinUrl?.trim()) || defaultPortfolioData.profile.linkedinUrl,
    websiteUrl:
      ensureExternalUrl(profileData?.websiteUrl?.trim()) || defaultPortfolioData.profile.websiteUrl,
    availableBadge: defaultPortfolioData.profile.availableBadge,
    ratingScore: defaultPortfolioData.profile.ratingScore,
    reviewsCount: defaultPortfolioData.profile.reviewsCount,
    reviewsLabel: defaultPortfolioData.profile.reviewsLabel,
    quote: defaultPortfolioData.profile.quote,
    stats: {
      projects: isProjectsLoaded
        ? projectsData.length
        : defaultPortfolioData.profile.stats.projects,
      yearsExp: isExperiencesLoaded
        ? calculateYearsExp(experiencesData)
        : defaultPortfolioData.profile.stats.yearsExp,
      awards: isAwardsLoaded
        ? awardsData.length
        : defaultPortfolioData.profile.stats.awards,
      articles: isBlogsLoaded
        ? blogsData.length
        : defaultPortfolioData.profile.stats.articles,
      organizations: isOrganizationsLoaded
        ? organizationsData.length
        : defaultPortfolioData.profile.stats.organizations,
      academics: isAcademicsLoaded
        ? academicsData.length
        : (defaultPortfolioData.profile.stats.academics ?? 2),
    },
    showBlog: profileData?.showBlog !== false,
    showProjects: profileData?.showProjects !== false,
    showExperiences: profileData?.showExperiences !== false,
    showAcademics: profileData?.showAcademics !== false,
    showAwards: profileData?.showAwards !== false,
    showOrganizations: profileData?.showOrganizations !== false,
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
  const mappedApiBlogs: PortfolioBlog[] =
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

  // Ensure at least 4 articles are available for the 1 lead + 3 secondary stacked layout
  const fallbackBlogs = defaultPortfolioData.blogs || [];
  const mappedBlogs: PortfolioBlog[] =
    mappedApiBlogs.length >= 4
      ? mappedApiBlogs
      : [
          ...mappedApiBlogs,
          ...fallbackBlogs.filter(
            (fb) => !mappedApiBlogs.some((mb) => mb.slug === fb.slug || mb.id === fb.id)
          ),
        ];

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
