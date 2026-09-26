"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, BookOpen } from "lucide-react";
import { SectionHeader, Button, Badge } from "@/components/atoms";
import { PortfolioBlog } from "@/types/portfolio";

export interface BlogSectionProps {
  blogs?: PortfolioBlog[];
  lang?: string;
  className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs = [],
  lang = "en",
  className = "",
}) => {
  if (!blogs || blogs.length === 0) return null;

  // Format creation date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const displayedBlogs = blogs.slice(0, 4);

  return (
    <section className={`py-20 md:py-28 relative scroll-mt-20 ${className}`} id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with "View All" Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <SectionHeader
            eyebrow="— Insights & Writing"
            title={
              <>
                Latest <span className="text-[#FF462E]">Articles</span>
              </>
            }
            description="Kumpulan artikel dan tulisan seputar rekayasa web modern, arsitektur sistem, dan inovasi UI/UX."
            hasSparkle={true}
          />

          <Button
            href={`/blog${lang ? `?lang=${lang}` : ""}`}
            variant="outline"
            icon={<ArrowUpRight className="w-4 h-4" />}
            className="self-start md:self-auto"
          >
            {lang === "en" ? "View All Articles" : "Semua Artikel"}
          </Button>
        </div>

        {/* Minimalist Editorial Magazine List (Option A) */}
        <div className="flex flex-col divide-y divide-[#ECE8DF] border-y border-[#ECE8DF]">
          {displayedBlogs.map((blog, idx) => {
            const detailUrl = `/blog/${blog.slug}${lang ? `?lang=${lang}` : ""}`;
            const indexNumber = String(idx + 1).padStart(2, "0");

            return (
              <motion.article
                key={blog.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="group relative transition-all duration-300 hover:bg-white/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 -mx-2 sm:-mx-4 my-1 border border-transparent hover:border-[#ECE8DF] hover:shadow-lg hover:shadow-black/[0.02]"
              >
                <Link
                  href={detailUrl}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8"
                >
                  {/* Left & Center Information */}
                  <div className="flex items-start gap-4 sm:gap-8 flex-1 min-w-0">
                    {/* Monospace Index Number */}
                    <span className="font-mono text-xs sm:text-sm font-semibold text-[#888899] group-hover:text-[#FF462E] transition-colors pt-1 shrink-0 select-none">
                      {indexNumber}
                    </span>

                    {/* Content Block */}
                    <div className="flex-1 min-w-0">
                      {/* Meta Details: Date & Read Time */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#666672] mb-2 sm:mb-2.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#FF462E]" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <span className="text-[#ECE8DF]">•</span>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#A0A0B8]" />
                          <span>
                            {blog.readTime || 5} {lang === "en" ? "min read" : "menit baca"}
                          </span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight leading-snug mb-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-xs sm:text-sm text-[#666672] line-clamp-2 leading-relaxed max-w-3xl mb-3 sm:mb-3.5">
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Tags Badges Row */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {blog.tags.slice(0, 3).map((tag, tIdx) => (
                            <Badge key={tIdx} variant="subtle" className="text-[11px] py-0.5 px-2.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Thumbnail & Circular Action Arrow */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#ECE8DF]/60 lg:border-none">
                    {/* Compact Modern Thumbnail */}
                    <div className="relative w-28 sm:w-36 h-18 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#ECE8DF] bg-[#0F0F11] shadow-xs group-hover:shadow-md transition-shadow">
                      {blog.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.coverImageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-[#1C1C20] to-[#0A0A0C]">
                          <BookOpen className="w-5 h-5 text-[#FF462E] mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                            Article
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Circular Action Arrow */}
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F5F2EB] group-hover:bg-[#FF462E] text-[#121214] group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs group-hover:scale-105 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
