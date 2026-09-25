"use client";

import React from "react";
import {
  Navbar,
  HeroSection,
  MarqueeTicker,
  ServicesSection,
  AboutSection,
  ProjectsSection,
  ContactSection,
} from "@/components/organisms";
import {
  PortfolioProfile,
  PortfolioService,
  PortfolioProject,
  PortfolioReview,
  PortfolioSkillTag,
} from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface PortfolioTemplateProps {
  profile?: PortfolioProfile;
  services?: PortfolioService[];
  projects?: PortfolioProject[];
  reviews?: PortfolioReview[];
  heroSkills?: PortfolioSkillTag[];
  marqueeItems?: string[];
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
      className={`min-h-screen bg-[#FDFBF7] bg-grid-canvas text-[#121214] font-sans antialiased relative selection:bg-[#FF462E] selection:text-white overflow-x-hidden ${className}`}
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

        {/* Featured Projects with Dynamic Category Filter & Interactive Cards */}
        <ProjectsSection projects={projects} />

        {/* Interactive Contact & Inquiry Section */}
        <ContactSection profile={profile} />
      </main>
    </div>
  );
};

export default PortfolioTemplate;
