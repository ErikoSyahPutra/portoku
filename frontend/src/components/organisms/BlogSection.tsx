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

  return (
    <section className={`py-20 md:py-28 relative ${className}`} id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with "View All" Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="— Insights & Writing"
            title={
              <>
                Latest <span className="text-[#FF462E]">Articles</span>
              </>
            }
            description="Kumpulan artikel dan tulisan seputar rekayasa web modern, arsitektur sistem, dan inovasi UI/UX."
          />

          <Button
            href={`/blog${lang ? `?lang=${lang}` : ""}`}
            variant="outline"
            icon={<ArrowUpRight className="w-4 h-4" />}
            className="self-start md:self-auto"
          >
            View All Articles
          </Button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.slice(0, 3).map((blog, idx) => {
            return (
              <motion.article
                key={blog.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF462E]/5 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Cover Image */}
                  <Link
                    href={`/blog/${blog.slug}${lang ? `?lang=${lang}` : ""}`}
                    className="block relative w-full h-44 rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-[#1B1B1F] to-[#0F0F11]"
                  >
                    {blog.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-radial-glow opacity-30" />
                        <div className="w-12 h-12 rounded-full bg-[#FF462E]/10 border border-[#FF462E]/30 flex items-center justify-center text-[#FF462E] mb-2 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                          Article
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Meta: Date & Read Time */}
                  <div className="flex items-center gap-3 text-xs text-[#666672] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF462E]" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A0A0B8]" />
                      <span>{blog.readTime || 5} min read</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors line-clamp-2 leading-snug mb-2.5">
                    <Link href={`/blog/${blog.slug}${lang ? `?lang=${lang}` : ""}`}>
                      {blog.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-xs sm:text-sm text-[#666672] line-clamp-3 leading-relaxed mb-4">
                      {blog.excerpt}
                    </p>
                  )}
                </div>

                {/* Footer: Tags & Read Link */}
                <div className="pt-4 border-t border-[#ECE8DF]/80 flex items-center justify-between gap-2 mt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags && blog.tags.slice(0, 2).map((tag, tIdx) => (
                      <Badge key={tIdx} variant="subtle">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${blog.slug}${lang ? `?lang=${lang}` : ""}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF462E] group-hover:translate-x-0.5 transition-transform"
                    aria-label={`Read article: ${blog.title}`}
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
