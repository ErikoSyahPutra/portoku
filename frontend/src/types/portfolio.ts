export interface PortfolioProfile {
  name: string;
  title: string;
  bio: string;
  aboutMe: string;
  avatarUrl: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  availableBadge: string;
  ratingScore: string;
  reviewsCount: string;
  reviewsLabel: string;
  quote: string;
  stats: {
    projects: number;
    yearsExp: number;
    awards: number;
    articles: number;
    organizations: number;
  };
  showBlog?: boolean;
}

export interface PortfolioService {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  previewImage: string;
}

export interface PortfolioProject {
  id: string | number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface PortfolioSkillTag {
  label: string;
  position: "left" | "right" | "bottom";
  color?: string;
}

export interface PortfolioReview {
  id?: string | number;
  clientName: string;
  role: string;
  rating: number;
  quote: string;
  avatar?: string;
}

export interface PortfolioExperience {
  id: string | number;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  skills?: string[];
  logoUrl?: string;
}

export interface PortfolioAcademic {
  id: string | number;
  institution: string;
  degree: string;
  field: string;
  startYear: string | number;
  endYear?: string | number;
  gpa?: string | number;
  description?: string;
  logoUrl?: string;
}

export interface PortfolioBlog {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  tags: string[];
  readTime: number;
  createdAt: string;
}

export interface PortfolioTechItem {
  name: string;
  category: string;
  color?: string;
  iconName?: string;
}

export interface PortfolioTechStack {
  row1: PortfolioTechItem[];
  row2: PortfolioTechItem[];
}

export interface PortfolioData {
  profile: PortfolioProfile;
  services: PortfolioService[];
  heroSkills: PortfolioSkillTag[];
  marqueeItems: string[];
  projects: PortfolioProject[];
  reviews?: PortfolioReview[];
  experiences?: PortfolioExperience[];
  academics?: PortfolioAcademic[];
  blogs?: PortfolioBlog[];
  techStack?: PortfolioTechStack;
}

