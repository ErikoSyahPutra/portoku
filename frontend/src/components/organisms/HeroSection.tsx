"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SpinningBadge } from "@/components/atoms/SpinningBadge";
import { Badge } from "@/components/atoms/Badge";
import { SocialMediaGroup } from "@/components/molecules/SocialMediaGroup";
import { PortfolioProfile, PortfolioSkillTag } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface HeroSectionProps {
  profile?: PortfolioProfile;
  heroSkills?: PortfolioSkillTag[];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile = defaultPortfolioData.profile,
  heroSkills = defaultPortfolioData.heroSkills,
  className = "",
}) => {
  return (
    <section
      id="hero"
      aria-label="Introduction Hero"
      className={`relative w-full pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Header Area: Intro Pill + Spinning Badge Floating Top-Right */}
        <div className="flex flex-col items-center text-center relative z-20 mb-8 sm:mb-12">
          {/* Top Pill Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 shadow-xs mb-4 select-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF462E] animate-ping" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#0F0F11]">
              — Hello There!
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0F0F11] leading-[1.06]"
          >
            I&apos;m{" "}
            <span className="text-[#FF462E] underline decoration-[#FF462E]/20 decoration-wavy underline-offset-8">
              {profile.name}
            </span>
          </motion.h1>

          {/* Subtitle / Role Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl md:text-2xl text-neutral-600 font-medium max-w-2xl"
          >
            {profile.title} based in{" "}
            <span className="text-[#0F0F11] font-semibold">{profile.location}</span>
          </motion.p>

          {/* Top-Right Floating Spinning Badge (Desktop / Tablet) */}
          <div className="hidden md:block absolute right-4 lg:right-12 top-0 z-30">
            <SpinningBadge
              text="✦ HIRE ME ✦ AVAILABLE NOW ✦ HIRE ME ✦ AVAILABLE NOW "
              href="#contact"
              size={136}
            />
          </div>

          {/* Top-Right Compact Spinning Badge (Mobile) */}
          <div className="block md:hidden absolute right-1 sm:right-3 top-0 z-30">
            <SpinningBadge
              text="✦ HIRE ME ✦ AVAILABLE NOW ✦ HIRE ME ✦ AVAILABLE NOW "
              href="#contact"
              size={84}
            />
          </div>
        </div>

        {/* Centerpiece Visual & Overlaid Floating Cards */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-2 pb-4">
          {/* Subtle Ambient Glow Behind Arch */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[400px] sm:h-[550px] bg-[#FF462E]/15 rounded-full blur-3xl pointer-events-none -z-10"
          />

          {/* Concentric Geometric Rings Behind Arch */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center"
          >
            <div className="w-[360px] sm:w-[480px] md:w-[600px] lg:w-[680px] h-[360px] sm:h-[480px] md:h-[600px] lg:h-[680px] rounded-full border border-black/[0.04]" />
            <div className="absolute w-[280px] sm:w-[380px] md:w-[480px] lg:w-[540px] h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] rounded-full border border-dashed border-black/[0.06]" />
            <div className="absolute w-[200px] sm:w-[280px] md:w-[360px] lg:w-[400px] h-[200px] sm:h-[280px] md:h-[360px] lg:h-[400px] rounded-full border border-[#FF462E]/15" />
          </div>

          {/* Center Coral Arch Portrait Frame with Pure Geometric Curve */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-[4/5] rounded-t-full bg-gradient-to-b from-[#FF462E] via-[#FF543D] to-[#E63B24] p-2.5 sm:p-3 pb-0 shadow-2xl shadow-[#FF462E]/25 overflow-hidden"
          >
            {/* Soft inner highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none z-10" />

            {/* Profile Cutout Image with matching smooth arch */}
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover object-top rounded-t-full filter contrast-[1.05]"
              loading="eager"
            />
          </motion.div>

          {/* Dynamic Floating Skill Pills (Desktop lg+) */}
          <div className="hidden lg:block">
            {heroSkills.map((skill, index) => {
              // Well-spaced coordinates around the central arch
              const positions = [
                { top: "18%", left: "14%", delay: 0.3 },
                { top: "60%", left: "10%", delay: 0.8 },
                { top: "18%", right: "14%", delay: 0.5 },
                { top: "60%", right: "10%", delay: 1.0 },
                { bottom: "8%", left: "22%", delay: 0.7 },
              ];
              const pos = positions[index % positions.length];

              return (
                <div
                  key={skill.label}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    bottom: pos.bottom,
                  }}
                >
                  <Badge
                    variant="default"
                    floating={true}
                    delay={pos.delay}
                    icon={<Sparkles size={12} className="text-[#FF462E]" />}
                    className="pointer-events-auto bg-white/95 text-[#0F0F11] font-semibold text-xs shadow-md border-black/10 py-1.5 px-3.5"
                  >
                    {skill.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Skill Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-6 w-full max-w-md mx-auto px-4 lg:hidden z-20">
          {heroSkills.map((skill) => (
            <Badge
              key={skill.label}
              variant="default"
              icon={<Sparkles size={11} className="text-[#FF462E]" />}
              className="bg-white/95 text-[#0F0F11] font-semibold text-[11px] sm:text-xs shadow-xs border-black/10 py-1 px-3"
            >
              {skill.label}
            </Badge>
          ))}
        </div>

        {/* Bottom Actions Row: Dual CTAs + Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
        >
          {/* Dual Pill CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              href="#projects"
              variant="primary"
              size="lg"
              icon={<ArrowUpRight size={18} />}
              iconPosition="right"
              className="px-7 py-3.5 shadow-lg shadow-[#FF462E]/30"
            >
              Portfolio
            </Button>
            <Button
              href="#contact"
              variant="white"
              size="lg"
              className="px-7 py-3.5 border border-black/10 hover:border-black/20 shadow-xs hover:shadow-md"
            >
              Hire Me
            </Button>
          </div>

          {/* Divider Dot on wide screens */}
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-neutral-300" />

          {/* Social Media Links */}
          <SocialMediaGroup
            githubUrl={profile.githubUrl}
            linkedinUrl={profile.linkedinUrl}
            websiteUrl={profile.websiteUrl}
            email={profile.email}
            size="md"
            variant="outline"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
