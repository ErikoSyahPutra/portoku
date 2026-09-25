"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { PortfolioProject } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface ProjectsSectionProps {
  projects?: PortfolioProject[];
  className?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = defaultPortfolioData.projects,
  className = "",
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

  return (
    <section
      id="projects"
      aria-label="Featured Engineering Projects"
      className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <SectionHeader
          eyebrow="— Featured Work"
          title="Recent Projects"
          highlightWord="Projects"
          description="A curated selection of full-stack platforms, design systems, and web applications engineered for performance and real-world scale."
          hasSparkle={true}
        />

        {/* View GitHub CTA */}
        <div className="shrink-0">
          <Button
            href="https://github.com/ErikoSyahPutra"
            variant="outline"
            size="md"
            icon={<Github size={16} />}
            iconPosition="left"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore GitHub
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
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

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-black/10 hover:border-black/20 shadow-xs hover:shadow-xl transition-all duration-300 p-5 sm:p-6 overflow-hidden"
            >
              <div>
                {/* Project Image Container */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-5">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[11px] font-semibold text-white tracking-wide shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF462E] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F11] group-hover:text-[#FF462E] transition-colors">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="mt-2.5 text-sm sm:text-base text-neutral-600 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="subtle"
                        className="text-[11px] font-medium py-0.5 px-2.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[11px] text-neutral-400 self-center font-mono">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 pt-5 border-t border-black/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <Button
                      href={project.liveUrl}
                      variant="primary"
                      size="sm"
                      icon={<ArrowUpRight size={14} />}
                      iconPosition="right"
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={`Live demo for ${project.title}`}
                    >
                      Live Demo
                    </Button>
                  )}

                  {project.githubUrl && (
                    <Button
                      href={project.githubUrl}
                      variant="outline"
                      size="sm"
                      icon={<Github size={14} />}
                      iconPosition="left"
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={`GitHub repository for ${project.title}`}
                    >
                      Code
                    </Button>
                  )}
                </div>

                <div className="text-neutral-400 group-hover:text-[#FF462E] transition-colors">
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
