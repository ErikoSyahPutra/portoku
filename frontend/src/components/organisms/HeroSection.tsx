"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SpinningBadge } from "@/components/atoms/SpinningBadge";
import { Badge } from "@/components/atoms/Badge";
import { RatingBadge } from "@/components/molecules/RatingBadge";
import { QuoteCard } from "@/components/molecules/QuoteCard";
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

          {/* Top-Right Floating Spinning Badge (Visible on desktop/tablet) */}
          <div className="hidden md:block absolute right-4 lg:right-12 top-0 z-30">
            <SpinningBadge
              text="✦ HIRE ME ✦ AVAILABLE NOW ✦ HIRE ME ✦ AVAILABLE NOW "
              href="#contact"
              size={136}
            />
          </div>
        </div>

        {/* Centerpiece Visual & Overlaid Floating Cards */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-2 pb-6">
          {/* Subtle Ambient Glow Behind Arch */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[400px] sm:h-[550px] bg-[#FF462E]/15 rounded-full blur-3xl pointer-events-none -z-10"
          />

          {/* Center Coral Arch Portrait Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-64 sm:w-80 md:w-96 aspect-[4/5] rounded-t-[140px] sm:rounded-t-[190px] bg-gradient-to-b from-[#FF462E] via-[#FF5742] to-[#E63B24] p-2.5 pb-0 shadow-2xl shadow-[#FF462E]/20 overflow-hidden"
          >
            {/* Soft inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none z-10" />

            {/* Profile Cutout Image */}
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover object-top rounded-t-[130px] sm:rounded-t-[178px] filter contrast-[1.05]"
              loading="eager"
            />
          </motion.div>

          {/* Left Floating Element: Rating Badge */}
          <div className="static mt-6 md:mt-0 md:absolute md:left-4 lg:left-8 md:top-1/3 z-30">
            <RatingBadge
              ratingScore={profile.ratingScore}
              reviewsCount={profile.reviewsCount}
              reviewsLabel={profile.reviewsLabel}
              floating={true}
              delay={0.2}
            />
          </div>

          {/* Right Floating Element: Quote Card */}
          <div className="static mt-4 md:mt-0 md:absolute md:right-4 lg:right-6 md:top-1/4 z-30">
            <QuoteCard
              quote={profile.quote}
              author="Valued Client Review"
              role="Tech Lead & Founder"
              floating={true}
              delay={0.6}
              className="max-w-xs"
            />
          </div>

          {/* Dynamic Floating Skill Pills (Pillows around arch) */}
          <div className="hidden lg:block">
            {heroSkills.map((skill, index) => {
              // Custom positioning for skills
              const positions = [
                { top: "60%", left: "12%", delay: 0.3 },
                { top: "68%", right: "10%", delay: 0.8 },
                { bottom: "14%", left: "22%", delay: 0.5 },
                { top: "18%", left: "18%", delay: 1.0 },
                { bottom: "10%", right: "18%", delay: 0.7 },
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

        {/* Bottom Actions Row: Dual CTAs + Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
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
              variant="outline"
              size="lg"
              className="px-7 py-3.5"
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
