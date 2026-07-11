const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API}${endpoint}`, { cache: "no-store" });
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
  id: number; title: string; description: string; imageUrl?: string;
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
  getProfile: () => fetcher<Profile>("/profile"),
  getProjects: () => fetcher<Project[]>("/projects"),
  getAcademics: () => fetcher<Academic[]>("/academics"),
  getExperiences: () => fetcher<Experience[]>("/experiences"),
  getBlogs: () => fetcher<Blog[]>("/blogs"),
  getBlog: (slug: string) => fetcher<Blog>(`/blogs/slug/${slug}`),
  getAwards: () => fetcher<Award[]>("/awards"),
};
