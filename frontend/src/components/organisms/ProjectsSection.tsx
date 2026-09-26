"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Sparkles, Layers } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { PortfolioProject } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface ProjectsSectionProps {
  projects?: PortfolioProject[];
  className?: string;
  limit?: number;
  showDiscoveryCard?: boolean;
  showHeader?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = defaultPortfolioData.projects,
  className = "",
  limit = 3,
  showDiscoveryCard = true,
  showHeader = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Derive unique categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Featured flagship project is either the first featured item or index 0
  const featuredProject = useMemo(() => {
    return filteredProjects.find((p) => p.featured) || filteredProjects[0];
  }, [filteredProjects]);

  // Remaining projects for alternating magazine spread
  const alternatingProjects = useMemo(() => {
    if (!featuredProject) return [];
    return filteredProjects.filter((p) => p.id !== featuredProject.id);
  }, [filteredProjects, featuredProject]);

  // Curated alternating list based on limit
  const displayedAlternating = useMemo(() => {
    if (limit && limit > 0) {
      return alternatingProjects.slice(0, Math.max(0, limit - 1));
    }
    return alternatingProjects;
  }, [alternatingProjects, limit]);

  return (
    <section
      id="projects"
      aria-label="Featured Engineering Projects"
      className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {/* Section Header */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <SectionHeader
            eyebrow="— Featured Work & Case Studies"
            title="Recent Projects"
            highlightWord="Projects"
            description="Karya rekayasa sistem web full-stack, perancangan arsitektur modern, dan platform digital berkinerja tinggi."
            hasSparkle={true}
          />

          {/* View GitHub CTA */}
          <div className="shrink-0 flex items-center gap-3">
            <Button
              href="/projects"
              variant="outline"
              size="md"
              icon={<ArrowUpRight size={16} />}
              iconPosition="right"
            >
              Semua Proyek
            </Button>
            <Button
              href="https://github.com/ErikoSyahPutra"
              variant="dark"
              size="md"
              icon={<Github size={16} />}
              iconPosition="left"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? "bg-[#FF462E] text-white shadow-md shadow-[#FF462E]/25"
                  : "bg-white/80 hover:bg-white text-neutral-600 hover:text-[#0F0F11] border border-black/10"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Hybrid Showcase Container */}
      <div className="space-y-12 sm:space-y-16">
        <AnimatePresence mode="wait">
          {featuredProject && (
            <motion.div
              key={`featured-${featuredProject.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* ======================================================== */}
              {/* STAGE 1: FLAGSHIP SPOTLIGHT (OPTION C STYLE) */}
              {/* ======================================================== */}
              <article className="bg-[#0F0F11] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Ambient Coral Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF462E]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Eyebrow & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FF462E] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        Featured Case Study
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-semibold">
                        {featuredProject.category}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono tracking-wider">
                      Flagship Project
                    </span>
                  </div>

                  {/* Title & Narrative */}
                  <div className="max-w-3xl mb-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 group-hover:text-[#FF462E] transition-colors">
                      <Link href={`/projects/${featuredProject.id}`}>
                        {featuredProject.title}
                      </Link>
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                      {featuredProject.description}
                    </p>
                  </div>

                  {/* High-Fidelity Browser Frame Mockup */}
                  <Link
                    href={`/projects/${featuredProject.id}`}
                    className="block w-full rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl mb-8 group/frame cursor-pointer"
                  >
                    <div className="h-9 bg-[#1A1A1E] px-4 flex items-center justify-between border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                        <span className="ml-3 text-xs text-neutral-400 font-mono hidden sm:inline">
                          https://erikosyah.my.id/projects/{featuredProject.id}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        interactive preview
                      </span>
                    </div>
                    <div className="max-h-[240px] sm:max-h-[360px] lg:max-h-[460px] overflow-hidden bg-[#0A0A0C]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredProject.imageUrl}
                        alt={featuredProject.title}
                        className="w-full h-auto object-cover object-top group-hover/frame:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Metrics Bar & Action Row */}
                  <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {featuredProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-white/10 text-neutral-200 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        href={`/projects/${featuredProject.id}`}
                        variant="primary"
                        size="md"
                        icon={<ArrowUpRight size={16} />}
                        iconPosition="right"
                      >
                        Lihat Studi Kasus
                      </Button>

                      {featuredProject.liveUrl && (
                        <Button
                          href={featuredProject.liveUrl}
                          variant="dark"
                          size="md"
                          icon={<ExternalLink size={14} />}
                          iconPosition="right"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo
                        </Button>
                      )}

                      {featuredProject.githubUrl && (
                        <Button
                          href={featuredProject.githubUrl}
                          variant="dark"
                          size="md"
                          icon={<Github size={14} />}
                          iconPosition="left"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Repository
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* STAGE 2: ALTERNATING MAGAZINE SPREAD (OPTION B STYLE) */}
        {/* ======================================================== */}
        <div className="space-y-10 sm:space-y-14">
          <AnimatePresence>
            {displayedAlternating.map((project, idx) => {
              const isEven = idx % 2 === 1;
              const detailUrl = `/projects/${project.id}`;

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`bg-white/85 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col ${
                    isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-center gap-6 sm:gap-8 lg:gap-12 group`}
                >
                  {/* Browser Mockup Frame */}
                  <Link
                    href={detailUrl}
                    className="w-full lg:w-3/5 rounded-2xl overflow-hidden border border-[#ECE8DF] bg-[#0F0F11] shadow-md group-hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-8 bg-[#F5F2EB] border-b border-[#ECE8DF] px-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                        <span className="ml-2 text-[10px] text-[#888899] font-mono truncate max-w-[200px]">
                          {project.title.toLowerCase().replace(/\s+/g, "-")}.dev
                        </span>
                      </div>
                      <span className="text-[10px] text-[#888899] font-mono">
                        case-study
                      </span>
                    </div>
                    <div className="max-h-[220px] sm:max-h-[320px] lg:max-h-[360px] overflow-hidden bg-[#0F0F11]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Story & Specifications */}
                  <div className="w-full lg:w-2/5 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-bold uppercase tracking-wider">
                        0{idx + 2} / {project.category}
                      </span>
                      {project.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF462E] text-white text-[10px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight mb-3 group-hover:text-[#FF462E] transition-colors">
                      <Link href={detailUrl}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="text-sm sm:text-base text-[#4A4A57] leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-[#F5F2EB] text-xs font-medium text-[#4A4A57]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Call to Action Button */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F0F11] hover:bg-[#FF462E] text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm"
                      >
                        <span>Lihat Studi Kasus</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Catalog Discovery Card */}
        {showDiscoveryCard && projects.length > (limit || 3) && (
          <div className="pt-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:px-8 sm:py-5 rounded-3xl bg-white border border-[#ECE8DF] shadow-xs">
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF462E] block">
                  Katalog Direktori Proyek ({projects.length} Total)
                </span>
                <span className="text-sm font-semibold text-[#121214]">
                  Tertarik melihat seluruh eksperimen dan arsitektur kode lainnya?
                </span>
              </div>
              <Button
                href="/projects"
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={15} />}
                iconPosition="right"
              >
                Lihat Semua Proyek ({projects.length})
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
