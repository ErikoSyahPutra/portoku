"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { SectionHeader, Button } from "@/components/atoms";
import { PortfolioBlog } from "@/types/portfolio";

export interface BlogSectionProps {
  blogs?: PortfolioBlog[];
  lang?: string;
  className?: string;
}

const defaultBlogCovers = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
];

const getBlogCover = (blog: PortfolioBlog, idx: number): string => {
  if (blog.coverImageUrl && blog.coverImageUrl.trim()) {
    const trimmed = blog.coverImageUrl.trim();
    if (trimmed.startsWith("http")) return trimmed;
    const BACKEND =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";
    return `${BACKEND}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }
  return defaultBlogCovers[idx % defaultBlogCovers.length];
};

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

  const leadBlog = blogs[0];
  const secondaryBlogs = blogs.slice(1, 4);

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

        {/* Asymmetric Magazine Spread (Option B: 1 Lead + 3 Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Lead Article (Left 7 Columns) */}
          {leadBlog && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 group relative bg-[#0F0F11] text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[440px] sm:min-h-[480px] lg:h-full flex flex-col justify-end"
            >
              {/* Background Cover Image with Ambient Dark Overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getBlogCover(leadBlog, 0)}
                  alt={leadBlog.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />
                {/* Multi-stop smooth dark gradient for optimal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/75 to-transparent pointer-events-none z-10" />
              </div>

              {/* Lead Article Content Overlay */}
              <Link
                href={`/blog/${leadBlog.slug}${lang ? `?lang=${lang}` : ""}`}
                className="relative z-20 p-6 sm:p-10 flex flex-col justify-end h-full"
              >
                {/* Top Badge & Eyebrow */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#FF462E] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {leadBlog.tags && leadBlog.tags[0] ? leadBlog.tags[0] : "Featured"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10">
                    Lead Story
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white group-hover:text-[#FF462E] transition-colors tracking-tight leading-tight mb-3">
                  {leadBlog.title}
                </h3>

                {/* Excerpt */}
                {leadBlog.excerpt && (
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed max-w-xl mb-6">
                    {leadBlog.excerpt}
                  </p>
                )}

                {/* Meta Row: Date, Read Time & Action Arrow */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#FF462E]" />
                      <span>{formatDate(leadBlog.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        {leadBlog.readTime || 5} {lang === "en" ? "min read" : "menit baca"}
                      </span>
                    </div>
                  </div>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 group-hover:bg-[#FF462E] text-white backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-md">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Secondary Stacked Articles (Right 5 Columns, 3 Articles) */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 justify-between">
            {secondaryBlogs.map((blog, idx) => {
              const detailUrl = `/blog/${blog.slug}${lang ? `?lang=${lang}` : ""}`;

              return (
                <motion.article
                  key={blog.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: (idx + 1) * 0.08 }}
                  className="group bg-white/90 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex-1 flex flex-col justify-between"
                >
                  <Link href={detailUrl} className="block h-full flex flex-col justify-between">
                    <div>
                      {/* Top Row: Thumbnail + Category Pill */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-[#ECE8DF] bg-[#0F0F11] shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getBlogCover(blog, idx + 1)}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-0">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FF462E]">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span className="truncate">{blog.tags && blog.tags[0] ? blog.tags[0] : "Tech Insight"}</span>
                          </span>
                          <div className="flex items-center gap-2 text-xs text-[#888899]">
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Headline */}
                      <h4 className="text-base sm:text-lg font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors line-clamp-2 leading-snug mb-2">
                        {blog.title}
                      </h4>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-xs sm:text-sm text-[#666672] line-clamp-2 leading-relaxed mb-4">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#ECE8DF] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#888899] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#A0A0B8]" />
                        <span>
                          {blog.readTime || 5} {lang === "en" ? "min read" : "menit baca"}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-bold text-[#121214] group-hover:text-[#FF462E] group-hover:translate-x-0.5 transition-all">
                        <span>Baca Artikel</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
