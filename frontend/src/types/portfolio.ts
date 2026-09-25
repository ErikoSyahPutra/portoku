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

export interface PortfolioData {
  profile: PortfolioProfile;
  services: PortfolioService[];
  heroSkills: PortfolioSkillTag[];
  marqueeItems: string[];
  projects: PortfolioProject[];
  reviews?: PortfolioReview[];
}
