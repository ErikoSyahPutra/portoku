"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, Briefcase, Calendar, Code, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { PortfolioProfile } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface AboutSectionProps {
  profile?: PortfolioProfile;
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile = defaultPortfolioData.profile,
  className = "",
}) => {
  const bioParagraphs = (profile.aboutMe || profile.bio)
    .split("\n\n")
    .filter(Boolean);

  const stats = [
    {
      label: "Years Experience",
      value: `${profile.stats?.yearsExp ?? 3}+`,
      icon: <Calendar size={18} className="text-[#FF462E]" />,
    },
    {
      label: "Projects Completed",
      value: `${profile.stats?.projects ?? 20}+`,
      icon: <Briefcase size={18} className="text-[#FF462E]" />,
    },
    {
      label: "Awards & Honors",
      value: `${profile.stats?.awards ?? 4}`,
      icon: <Award size={18} className="text-[#FF462E]" />,
    },
    {
      label: "Articles & Pubs",
      value: `${profile.stats?.articles ?? 8}`,
      icon: <FileText size={18} className="text-[#FF462E]" />,
    },
  ];

  return (
    <section
      id="about"
      aria-label="About the Engineer"
      className={`py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {/* Standout Dark Contrast Card Container */}
      <div className="relative bg-[#0F0F11] text-white rounded-3xl md:rounded-[36px] p-6 sm:p-10 md:p-14 lg:p-16 border border-white/10 shadow-2xl overflow-hidden">
        {/* Ambient Decorative Glows */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF462E]/15 rounded-full blur-[100px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF462E]/10 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Visual with Cutout Avatar & Warm Geometric Backdrop */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-tr from-[#FF462E]/25 via-[#1A1A1E] to-[#16161A] p-3 sm:p-4 border border-white/15 shadow-2xl flex flex-col items-center justify-end overflow-hidden group">
              {/* Background Geometric Rings */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
              >
                <div className="w-64 h-64 rounded-full border border-dashed border-white/40" />
                <div className="absolute w-44 h-44 rounded-full border border-white/30" />
              </div>

              {/* Portrait Image */}
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover object-top rounded-2xl filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Overlaid Floating Status Pill */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-white/90 truncate">
                    {profile.availableBadge || "Available for Opportunities"}
                  </span>
                </div>
              </div>
            </div>

            {/* Overlaid Skill Tags Row */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm">
              <Badge variant="dark" className="border-white/15 text-[11px] py-1 px-3">
                Full-Stack Architecture
              </Badge>
              <Badge variant="dark" className="border-white/15 text-[11px] py-1 px-3">
                Next.js & TypeScript
              </Badge>
              <Badge variant="dark" className="border-white/15 text-[11px] py-1 px-3">
                REST & WebSockets
              </Badge>
            </div>
          </div>

          {/* Right Column: Editorial Bio, Stats & Download CV */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#FF462E]" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FF462E]">
                — About Me
              </span>
            </div>

            {/* Section Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Who is {profile.name}? <span className="inline-block">✨</span>
            </h2>

            {/* Rich Bio Text */}
            <div className="mt-6 space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              {bioParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Numerical Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-8 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-start gap-1"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {stat.icon}
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-neutral-400 font-medium leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Row: Download CV CTA + Elegant Cursive Signature Display */}
            <div className="mt-8 pt-8 border-t border-white/10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <Button
                href="/cv.pdf"
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={16} />}
                iconPosition="right"
                className="shadow-md shadow-[#FF462E]/25"
                download="Eriko_Syah_Putra_CV.pdf"
              >
                Download CV
              </Button>

              {/* Editorial Handwritten/Script Signature Display */}
              <div className="flex flex-col items-start sm:items-end">
                <span className="font-signature text-3xl sm:text-4xl text-[#FF462E] font-medium leading-none select-none tracking-normal drop-shadow-sm">
                  {profile.name}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mt-1">
                  Full-Stack Engineer &amp; Designer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
