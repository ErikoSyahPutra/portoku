const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetcher<T>(endpoint: string, lang?: string): Promise<T> {
  const query = lang ? `?lang=${lang}` : '';
  const res = await fetch(`${API}${endpoint}${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Profile {
  id: number; name: string; title: string; bio: string; aboutMe: string;
  avatarUrl?: string; email?: string; phone?: string; location?: string;
  githubUrl?: string; linkedinUrl?: string; twitterUrl?: string; websiteUrl?: string; resumeUrl?: string;
  showProjects?: boolean; showExperiences?: boolean; showAcademics?: boolean; showBlog?: boolean; showAwards?: boolean;
}
export interface Project {
  id: number; title: string; description: string; content?: string; imageUrl?: string;
  liveUrl?: string; githubUrl?: string; technologies: string[]; featured: boolean; order: number;
}
export interface Academic {
  id: number; institution: string; degree: string; field: string;
  startYear: number; endYear?: number; gpa?: string; description?: string; logoUrl?: string;
}
export interface Experience {
  id: number; company: string; position: string; location?: string;
  startDate: string; endDate?: string; current: boolean; description?: string; skills: string[]; logoUrl?: string;
}
export interface Blog {
  id: number; title: string; slug: string; excerpt: string; content: string;
  coverImageUrl?: string; tags: string[]; published: boolean; readTime: number; createdAt: string;
}
export interface Award {
  id: number; title: string; issuer: string; year: number;
  description?: string; imageUrl?: string; credentialUrl?: string;
}

export const api = {
  getProfile: (lang?: string) => fetcher<Profile>("/profile", lang),
  getProjects: (lang?: string) => fetcher<Project[]>("/projects", lang),
  getProject: (id: number, lang?: string) => fetcher<Project>(`/projects/${id}`, lang),
  getAcademics: (lang?: string) => fetcher<Academic[]>("/academics", lang),
  getExperiences: (lang?: string) => fetcher<Experience[]>("/experiences", lang),
  getBlogs: (lang?: string) => fetcher<Blog[]>("/blogs", lang),
  getBlog: (slug: string, lang?: string) => fetcher<Blog>(`/blogs/slug/${slug}`, lang),
  getAwards: (lang?: string) => fetcher<Award[]>("/awards", lang),
};
