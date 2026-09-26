"use client";

import React from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiRedux,
  SiHtml5,
  SiCss,
  SiNestjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiPrisma,
  SiSupabase,
  SiRedis,
  SiDocker,
  SiGit,
  SiFigma,
  SiPostman,
  SiPython,
  SiMongodb,
  SiGraphql,
  SiWordpress,
  SiVercel,
  SiLinux,
} from "react-icons/si";
import { Code2 } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { PortfolioTechStack, PortfolioTechItem } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

// Icon dictionary that maps names to official SVG icons
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  "next.js": SiNextdotjs,
  "next.js 15": SiNextdotjs,
  "react": SiReact,
  "typescript": SiTypescript,
  "javascript": SiJavascript,
  "tailwind css": SiTailwindcss,
  "tailwind": SiTailwindcss,
  "framer motion": SiFramer,
  "redux": SiRedux,
  "redux / zustand": SiRedux,
  "html5": SiHtml5,
  "css3": SiCss,
  "css": SiCss,
  "nestjs": SiNestjs,
  "node.js": SiNodedotjs,
  "express": SiExpress,
  "express.js": SiExpress,
  "postgresql": SiPostgresql,
  "mysql": SiMysql,
  "prisma": SiPrisma,
  "prisma orm": SiPrisma,
  "supabase": SiSupabase,
  "redis": SiRedis,
  "docker": SiDocker,
  "git": SiGit,
  "git & github": SiGit,
  "github": SiGit,
  "figma": SiFigma,
  "postman": SiPostman,
  "python": SiPython,
  "mongodb": SiMongodb,
  "graphql": SiGraphql,
  "wordpress": SiWordpress,
  "vercel": SiVercel,
  "linux": SiLinux,
};

function getTechIcon(item: PortfolioTechItem) {
  const key = (item.iconName || item.name).trim().toLowerCase();
  return ICON_MAP[key] || Code2;
}

export interface TechStackSectionProps {
  techStack?: PortfolioTechStack;
  className?: string;
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({
  techStack = defaultPortfolioData.techStack,
  className = "",
}) => {
  const row1 = techStack?.row1 || defaultPortfolioData.techStack?.row1 || [];
  const row2 = techStack?.row2 || defaultPortfolioData.techStack?.row2 || [];

  return (
    <section
      id="tech-stack"
      aria-label="Technologies and Tools"
      className={`py-16 md:py-24 relative overflow-hidden tech-stack-section [&:hover_.marquee-group]:[animation-play-state:paused] ${className}`}
    >
      {/* Section Header (Left-aligned matching other sections) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="— Tech Stack"
            title={
              <>
                Technologies & <span className="text-[#FF462E]">Tools</span>
              </>
            }
            description="Teknologi dan tools modern yang saya gunakan untuk membangun produk digital."
            hasSparkle={true}
          />
        </div>
      </div>

      {/* Marquee Wrapper Full Width - Pause on Hover with Smooth Fade Masks */}
      <div className="marquee-wrapper relative w-full overflow-hidden [&:hover_.marquee-group]:[animation-play-state:paused] py-2">
        {/* Left & Right Canvas Edge Fades (Mobile-friendly: narrower on mobile so cards are clear) */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-20 md:w-36 lg:w-48 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-20 md:w-36 lg:w-48 bg-gradient-to-l from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-3.5 sm:gap-6">
          {/* Track 1: Gerak Kiri (Row 1) */}
          {row1.length > 0 && (
            <div className="marquee-track flex w-max">
              {[0, 1, 2, 3].map((groupIndex) => (
                <div
                  key={`row1-group-${groupIndex}`}
                  className="marquee-group flex gap-2.5 sm:gap-4 pr-2.5 sm:pr-4"
                  aria-hidden={groupIndex > 0 ? "true" : undefined}
                >
                  {row1.map((tech, idx) => {
                    const Icon = getTechIcon(tech);
                    return (
                      <div
                        key={`r1-${tech.name}-${groupIndex}-${idx}`}
                        className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#FF462E]/50 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group select-none whitespace-nowrap cursor-pointer"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#F5F2EB] group-hover:bg-[#FFF1EE] flex items-center justify-center shrink-0 transition-colors duration-300">
                          <Icon
                            size={16}
                            className="transition-transform duration-300 group-hover:scale-110 sm:w-[18px] sm:h-[18px]"
                            style={{ color: tech.color || "#FF462E" }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight">
                          {tech.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Track 2: Gerak Kanan (Row 2) */}
          {row2.length > 0 && (
            <div className="marquee-track flex w-max">
              {[0, 1, 2, 3].map((groupIndex) => (
                <div
                  key={`row2-group-${groupIndex}`}
                  className="marquee-group group-right flex gap-2.5 sm:gap-4 pr-2.5 sm:pr-4"
                  aria-hidden={groupIndex > 0 ? "true" : undefined}
                >
                  {row2.map((tech, idx) => {
                    const Icon = getTechIcon(tech);
                    return (
                      <div
                        key={`r2-${tech.name}-${groupIndex}-${idx}`}
                        className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#FF462E]/50 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group select-none whitespace-nowrap cursor-pointer"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#F5F2EB] group-hover:bg-[#FFF1EE] flex items-center justify-center shrink-0 transition-colors duration-300">
                          <Icon
                            size={16}
                            className="transition-transform duration-300 group-hover:scale-110 sm:w-[18px] sm:h-[18px]"
                            style={{ color: tech.color || "#FF462E" }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight">
                          {tech.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
