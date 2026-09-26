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
} from "react-icons/si";
import { SectionHeader } from "@/components/atoms/SectionHeader";

export interface TechItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}

const ROW_1_TECHS: TechItem[] = [
  { name: "Next.js 15", category: "Full-Stack", icon: SiNextdotjs, color: "#000000" },
  { name: "React", category: "UI Library", icon: SiReact, color: "#149ECA" },
  { name: "TypeScript", category: "Language", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", category: "Language", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind CSS", category: "Styling", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Framer Motion", category: "Animation", icon: SiFramer, color: "#0055FF" },
  { name: "Redux / Zustand", category: "State Mgmt", icon: SiRedux, color: "#764ABC" },
  { name: "HTML5", category: "Structure", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", category: "Styling", icon: SiCss, color: "#1572B6" },
];

const ROW_2_TECHS: TechItem[] = [
  { name: "NestJS", category: "Backend Engine", icon: SiNestjs, color: "#E0234E" },
  { name: "Node.js", category: "Runtime", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", category: "REST API", icon: SiExpress, color: "#121214" },
  { name: "PostgreSQL", category: "SQL Database", icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", category: "SQL Database", icon: SiMysql, color: "#4479A1" },
  { name: "Prisma ORM", category: "Data Access", icon: SiPrisma, color: "#2D3748" },
  { name: "Supabase", category: "BaaS & Auth", icon: SiSupabase, color: "#3ECF8E" },
  { name: "Redis", category: "In-Memory Cache", icon: SiRedis, color: "#DC382D" },
  { name: "Docker", category: "Containers", icon: SiDocker, color: "#2496ED" },
  { name: "Git & GitHub", category: "Version Control", icon: SiGit, color: "#F05032" },
  { name: "Figma", category: "UI/UX Design", icon: SiFigma, color: "#F24E1E" },
  { name: "Postman", category: "API Testing", icon: SiPostman, color: "#FF6C37" },
];

export interface TechStackSectionProps {
  className?: string;
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({
  className = "",
}) => {
  return (
    <section
      id="tech-stack"
      aria-label="Technologies and Tools"
      className={`py-16 md:py-24 relative overflow-hidden ${className}`}
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
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

      {/* Marquee Wrapper with Smooth Canvas Edge Fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Canvas Edge Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 md:w-48 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 md:w-48 bg-gradient-to-l from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Track 1: Gerak Kiri (Frontend & UI) */}
          <div className="marquee-track flex w-max">
            {/* Repeat 4 times to ensure seamless infinite looping */}
            {[0, 1, 2, 3].map((groupIndex) => (
              <div
                key={`row1-group-${groupIndex}`}
                className="marquee-group flex gap-3 sm:gap-4 pr-3 sm:pr-4"
                aria-hidden={groupIndex > 0 ? "true" : undefined}
              >
                {ROW_1_TECHS.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={`r1-${tech.name}-${groupIndex}`}
                      className="inline-flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#FF462E]/40 shadow-xs hover:shadow-md transition-all duration-300 group select-none whitespace-nowrap cursor-default"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F5F2EB] group-hover:bg-[#FFF1EE] flex items-center justify-center shrink-0 transition-colors duration-300">
                        <Icon
                          size={18}
                          className="transition-transform duration-300 group-hover:scale-110"
                          style={{ color: tech.color }}
                        />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-xs sm:text-sm font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight">
                          {tech.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#888899] tracking-wider uppercase">
                          {tech.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Track 2: Gerak Kanan (Backend, Database & Tools) */}
          <div className="marquee-track flex w-max">
            {[0, 1, 2, 3].map((groupIndex) => (
              <div
                key={`row2-group-${groupIndex}`}
                className="marquee-group group-right flex gap-3 sm:gap-4 pr-3 sm:pr-4"
                aria-hidden={groupIndex > 0 ? "true" : undefined}
              >
                {ROW_2_TECHS.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={`r2-${tech.name}-${groupIndex}`}
                      className="inline-flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#FF462E]/40 shadow-xs hover:shadow-md transition-all duration-300 group select-none whitespace-nowrap cursor-default"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F5F2EB] group-hover:bg-[#FFF1EE] flex items-center justify-center shrink-0 transition-colors duration-300">
                        <Icon
                          size={18}
                          className="transition-transform duration-300 group-hover:scale-110"
                          style={{ color: tech.color }}
                        />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-xs sm:text-sm font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight">
                          {tech.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#888899] tracking-wider uppercase">
                          {tech.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
