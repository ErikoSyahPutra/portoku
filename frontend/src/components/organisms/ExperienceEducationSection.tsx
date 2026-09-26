"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { SectionHeader, Badge } from "@/components/atoms";
import {
  PortfolioExperience,
  PortfolioAcademic,
} from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

interface ExperienceEducationSectionProps {
  experiences?: PortfolioExperience[];
  academics?: PortfolioAcademic[];
}

export default function ExperienceEducationSection({
  experiences = defaultPortfolioData.experiences || [],
  academics = defaultPortfolioData.academics || [],
}: ExperienceEducationSectionProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

  // Format date display (e.g. 2025-05 -> May 2025)
  const formatPeriod = (start?: string | number, end?: string | number, current?: boolean) => {
    if (!start) return "";
    const formatSingle = (val: string | number) => {
      const str = String(val);
      if (str.length === 7 && str.includes("-")) {
        const [year, month] = str.split("-");
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const monthIdx = parseInt(month, 10) - 1;
        return `${monthNames[monthIdx] || month} ${year}`;
      }
      return str;
    };

    const startText = formatSingle(start);
    if (current) return `${startText} — Present`;
    if (!end) return startText;
    const endText = formatSingle(end);
    return `${startText} — ${endText}`;
  };

  // Parse multi-line description into bullet points
  const parseBullets = (desc?: string | string[]) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;
    return desc
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0);
  };

  return (
    <section className="py-20 md:py-28 relative" id="experience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="— Career & Academic Journey"
            title={
              <>
                Experience & <span className="text-[#FF462E]">Education</span>
              </>
            }
            description="Rekam jejak profesional dalam perancangan produk digital, rekayasa perangkat lunak, dan latar belakang pendidikan formal."
          />

          {/* Tab Switcher Pills */}
          <div className="inline-flex p-1.5 bg-[#F0EDE4] border border-[#ECE8DF] rounded-full self-start md:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("experience")}
              className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 z-10 ${
                activeTab === "experience"
                  ? "text-white"
                  : "text-[#666672] hover:text-[#121214]"
              }`}
            >
              {activeTab === "experience" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[#FF462E] rounded-full -z-10 shadow-sm shadow-[#FF462E]/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "experience"
                    ? "bg-white/20 text-white"
                    : "bg-black/5 text-[#666672]"
                }`}
              >
                {experiences.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("education")}
              className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 z-10 ${
                activeTab === "education"
                  ? "text-white"
                  : "text-[#666672] hover:text-[#121214]"
              }`}
            >
              {activeTab === "education" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[#FF462E] rounded-full -z-10 shadow-sm shadow-[#FF462E]/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "education"
                    ? "bg-white/20 text-white"
                    : "bg-black/5 text-[#666672]"
                }`}
              >
                {academics.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "experience" ? (
            <motion.div
              key="tab-experience"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {experiences.map((exp, index) => {
                const bullets = parseBullets(exp.description);
                return (
                  <div
                    key={exp.id || index}
                    className="group bg-white/90 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF462E]/5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    {/* Left Meta: Date & Location */}
                    <div className="lg:col-span-4 flex flex-col gap-2.5">
                      <div className="inline-flex items-center gap-1.5 bg-[#FFF1EE] text-[#FF462E] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{formatPeriod(exp.startDate, exp.endDate, exp.current)}</span>
                      </div>

                      {exp.current && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Currently Working Here
                        </div>
                      )}

                      {exp.location && (
                        <div className="flex items-center gap-1.5 text-xs text-[#666672] mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#A0A0B8] flex-shrink-0" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Details: Role, Company & Bullet Points */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors">
                          {exp.position}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-[#666672]">
                          <Building2 className="w-4 h-4 text-[#FF462E]" />
                          <span>{exp.company}</span>
                        </div>
                      </div>

                      {bullets.length > 0 && (
                        <ul className="space-y-2 mt-1">
                          {bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4A57] leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#FF462E] flex-shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#ECE8DF]/70">
                          {exp.skills.map((skill, sIdx) => (
                            <Badge key={sIdx} variant="subtle">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="tab-education"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {academics.map((acad, index) => {
                const bullets = parseBullets(acad.description);
                return (
                  <div
                    key={acad.id || index}
                    className="group bg-white/90 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF462E]/5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    {/* Left Meta: Years & GPA */}
                    <div className="lg:col-span-4 flex flex-col gap-2.5">
                      <div className="inline-flex items-center gap-1.5 bg-[#FFF1EE] text-[#FF462E] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {acad.startYear} — {acad.endYear || "Present"}
                        </span>
                      </div>

                      {acad.gpa && (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
                          <Award className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>IPK / Nilai: {acad.gpa}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Details: Degree, Field, Institution */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-black/5 text-[#121214]">
                            {acad.degree}
                          </span>
                          <h4 className="text-lg sm:text-xl font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors">
                            {acad.field}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-sm font-semibold text-[#666672]">
                          <GraduationCap className="w-4 h-4 text-[#FF462E]" />
                          <span>{acad.institution}</span>
                        </div>
                      </div>

                      {bullets.length > 0 && (
                        <ul className="space-y-2 mt-1">
                          {bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4A57] leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#FF462E] flex-shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
