"use client";

import React from "react";
import {
  Navbar,
  HeroSection,
  MarqueeTicker,
  ServicesSection,
  AboutSection,
  TechStackSection,
  ExperienceEducationSection,
  ProjectsSection,
  BlogSection,
  ContactSection,
} from "@/components/organisms";
import {
  PortfolioProfile,
  PortfolioService,
  PortfolioProject,
  PortfolioReview,
  PortfolioSkillTag,
  PortfolioExperience,
  PortfolioAcademic,
  PortfolioBlog,
  PortfolioTechStack,
} from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface PortfolioTemplateProps {
  profile?: PortfolioProfile;
  services?: PortfolioService[];
  projects?: PortfolioProject[];
  reviews?: PortfolioReview[];
  heroSkills?: PortfolioSkillTag[];
  marqueeItems?: string[];
  experiences?: PortfolioExperience[];
  academics?: PortfolioAcademic[];
  blogs?: PortfolioBlog[];
  techStack?: PortfolioTechStack;
  lang?: string;
  className?: string;
}

export const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({
  profile = defaultPortfolioData.profile,
  services = defaultPortfolioData.services,
  projects = defaultPortfolioData.projects,
  reviews = defaultPortfolioData.reviews || [],
  heroSkills = defaultPortfolioData.heroSkills,
  marqueeItems = defaultPortfolioData.marqueeItems,
  experiences = defaultPortfolioData.experiences || [],
  academics = defaultPortfolioData.academics || [],
  blogs = [],
  techStack = defaultPortfolioData.techStack,
  lang = "en",
  className = "",
}) => {
  // Ensure native overscroll / rubber-banding matches warm cream canvas
  React.useEffect(() => {
    const origBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#FDFBF7";
    return () => {
      document.body.style.backgroundColor = origBg;
    };
  }, []);
  return (
    <div
      className={`min-h-screen bg-[#FDFBF7] bg-grid-canvas text-[#121214] font-sans antialiased relative selection:bg-[#FF462E] selection:text-white overflow-x-clip ${className}`}
    >
      {/* Fixed / Sticky Navigation Bar */}
      <Navbar profile={profile} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection profile={profile} heroSkills={heroSkills} />

        {/* Infinite Running Marquee Ticker */}
        <MarqueeTicker items={marqueeItems} />

        {/* Services & Offerings Accordion */}
        <ServicesSection services={services} />

        {/* About Eriko Section with Photo, Bio & Experience/Education Stats */}
        <AboutSection profile={profile} />

        {/* Technologies & Tools Dual-Track Moving Marquee (placed directly above projects) */}
        <div className="section-lazy-render">
          <TechStackSection techStack={techStack} />
        </div>

        {/* Featured Projects with Dynamic Category Filter & Interactive Cards */}
        <div className="section-lazy-render">
          <ProjectsSection projects={projects} />
        </div>

        {/* Experience & Education Section (placed directly below projects) */}
        <div className="section-lazy-render">
          <ExperienceEducationSection experiences={experiences} academics={academics} />
        </div>

        {/* Blog & Articles Section (rendered when enabled in Admin & articles exist) */}
        {profile.showBlog !== false && blogs && blogs.length > 0 && (
          <div className="section-lazy-render">
            <BlogSection blogs={blogs} lang={lang} />
          </div>
        )}

        {/* Interactive Contact & Inquiry Section */}
        <div className="section-lazy-render">
          <ContactSection profile={profile} />
        </div>
      </main>
    </div>
  );
};

export default PortfolioTemplate;
