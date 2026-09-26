"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  ArrowLeft,
  Layers,
  LayoutGrid,
  Laptop,
} from "lucide-react";
import { defaultPortfolioData } from "@/data/portfolioData";

export default function PreviewProjectsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
  const projects = defaultPortfolioData.projects;

  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-grid-canvas text-[#121214] font-sans antialiased pb-32 selection:bg-[#FF462E] selection:text-white">
      {/* Sticky Top Control Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ECE8DF] py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#F5F2EB] hover:bg-[#FF462E] hover:text-white text-[#121214] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Portfolio Utama
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-[#888899]">
              Showcase 3 Mockup Pilihan
            </span>
          </div>

          {/* Quick Anchor Jumps */}
          <div className="inline-flex p-1.5 bg-[#F0EDE4] border border-[#ECE8DF] rounded-full shadow-inner gap-1">
            <button
              onClick={() => scrollTo("opsi-a")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#121214] hover:bg-white transition-all"
            >
              Opsi A: Kinetic List
            </button>
            <button
              onClick={() => scrollTo("opsi-b")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#121214] hover:bg-white transition-all"
            >
              Opsi B: Magazine Spread
            </button>
            <button
              onClick={() => scrollTo("opsi-c")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#121214] hover:bg-white transition-all"
            >
              Opsi C: Bento Spotlight
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-24">
        {/* Intro Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Galeri Mockup & Prototipe Interaktif
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121214] tracking-tight">
            Pilih Format Desain Recent Projects
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#666672] leading-relaxed">
            Di bawah ini ditampilkan ketiga opsi secara berurutan. Setiap opsi dilengkapi gambar rancangan visual asli dan prototipe interaktifnya.
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: OPSI A */}
        {/* ======================================================== */}
        <section id="opsi-a" className="scroll-mt-24">
          <div className="border-b border-[#ECE8DF] pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF462E]">
                Konsep 01
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight">
                Opsi A: Kinetic Editorial List
              </h2>
              <p className="text-sm text-[#666672] mt-1">
                Gaya Awwwards / Locomotive: Minimalis, hemat ruang, dan memunculkan floating preview saat kursor diarahkan.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-semibold self-start sm:self-auto">
              Interactive Hover Ready
            </span>
          </div>

          {/* Visual Image Render */}
          <div className="mb-8 rounded-3xl overflow-hidden border border-[#ECE8DF] shadow-md bg-white p-3">
            <div className="text-xs font-semibold text-[#888899] mb-2 px-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF462E]" />
              Rancangan Visual Opsi A:
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mockups/option_a.jpg"
              alt="Mockup Opsi A Kinetic List"
              className="w-full h-auto rounded-2xl"
            />
          </div>

          {/* Live Working Component */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#ECE8DF] rounded-3xl p-6 sm:p-10 shadow-sm relative">
            <div className="text-xs font-bold uppercase tracking-wider text-[#888899] mb-4">
              Coba Hover Pada Baris di Bawah:
            </div>
            <div className="divide-y divide-[#ECE8DF]">
              {projects.slice(0, 4).map((p, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className="py-6 sm:py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer transition-all duration-300 relative"
                  >
                    {/* Index & Title */}
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                      <span className="text-sm sm:text-base font-mono font-bold text-[#888899] group-hover:text-[#FF462E] transition-colors">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#121214] group-hover:text-[#FF462E] transition-colors tracking-tight">
                          {p.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#666672] mt-1 max-w-xl line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Tech Pills */}
                    <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto">
                      <div className="hidden sm:flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-[#F5F2EB] text-[#4A4A57] text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="w-10 h-10 rounded-full bg-[#F5F2EB] group-hover:bg-[#FF462E] text-[#121214] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 group-hover:scale-110 shadow-xs">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    {/* Hover Floating Mockup Preview */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="hidden xl:block absolute right-32 -top-12 z-30 pointer-events-none w-72 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-[#0F0F11]"
                        >
                          <div className="h-6 bg-[#1A1A1E] px-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                            <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                          </div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-40 object-cover object-top"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: OPSI B */}
        {/* ======================================================== */}
        <section id="opsi-b" className="scroll-mt-24">
          <div className="border-b border-[#ECE8DF] pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF462E]">
                Konsep 02
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight">
                Opsi B: Asymmetrical Alternating Magazine Spread
              </h2>
              <p className="text-sm text-[#666672] mt-1">
                Gaya Editorial Majalah / Case Study: Mockup frame browser besar bergantian kiri-kanan dengan narasi lengkap.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-semibold self-start sm:self-auto">
              Showcase Besar & Megah
            </span>
          </div>

          {/* Visual Image Render */}
          <div className="mb-8 rounded-3xl overflow-hidden border border-[#ECE8DF] shadow-md bg-white p-3">
            <div className="text-xs font-semibold text-[#888899] mb-2 px-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF462E]" />
              Rancangan Visual Opsi B:
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mockups/option_b.jpg"
              alt="Mockup Opsi B Magazine Spread"
              className="w-full h-auto rounded-2xl"
            />
          </div>

          {/* Live Working Component */}
          <div className="space-y-10">
            {projects.slice(0, 2).map((p, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={p.id}
                  className={`bg-white/85 border border-[#ECE8DF] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col ${
                    isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-center gap-8 lg:gap-12 group hover:border-[#FF462E]/30 transition-all`}
                >
                  {/* Browser Mockup Frame */}
                  <div className="w-full lg:w-3/5 rounded-2xl overflow-hidden border border-[#ECE8DF] bg-[#0F0F11] shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="h-8 bg-[#F5F2EB] border-b border-[#ECE8DF] px-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-2 text-[10px] text-[#888899] font-mono truncate">
                        {p.title.toLowerCase().replace(/\s+/g, "-")}.dev
                      </span>
                    </div>
                    <div className="max-h-[320px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Story & Specifications */}
                  <div className="w-full lg:w-2/5 flex flex-col items-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-bold uppercase tracking-wider mb-4">
                      0{idx + 1} / {p.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight mb-3">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#4A4A57] leading-relaxed mb-6">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full bg-[#F5F2EB] text-xs font-medium text-[#4A4A57]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F0F11] hover:bg-[#FF462E] text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm"
                    >
                      <span>Explore Case Study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: OPSI C */}
        {/* ======================================================== */}
        <section id="opsi-c" className="scroll-mt-24">
          <div className="border-b border-[#ECE8DF] pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF462E]">
                Konsep 03
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight">
                Opsi C: Asymmetrical Bento Spotlight
              </h2>
              <p className="text-sm text-[#666672] mt-1">
                Gaya Silicon Valley / Linear: 1 kartu hitam utama mendominasi 65% lebar dengan metrik, didampingi kartu pendukung.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1EE] text-[#FF462E] text-xs font-semibold self-start sm:self-auto">
              High Authority & Metrics
            </span>
          </div>

          {/* Visual Image Render */}
          <div className="mb-8 rounded-3xl overflow-hidden border border-[#ECE8DF] shadow-md bg-white p-3">
            <div className="text-xs font-semibold text-[#888899] mb-2 px-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF462E]" />
              Rancangan Visual Opsi C:
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mockups/option_c.jpg"
              alt="Mockup Opsi C Bento Spotlight"
              className="w-full h-auto rounded-2xl"
            />
          </div>

          {/* Live Working Component */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Featured Masterpiece Card (65% width) */}
            <div className="lg:col-span-8 bg-[#0F0F11] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF462E]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#FF462E] text-white text-xs font-bold uppercase tracking-wider">
                    Featured Case Study
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Flagship Project
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                  {projects[0].title}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl mb-8">
                  {projects[0].description}
                </p>

                {/* Browser Showcase */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl mb-8">
                  <div className="h-8 bg-[#1A1A1E] px-3 flex items-center gap-2 border-b border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={projects[0].imageUrl}
                    alt={projects[0].title}
                    className="w-full max-h-72 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Metrics & Action Bar */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-xs text-neutral-300">
                  <div>
                    <span className="block font-bold text-base text-white">99.9%</span>
                    <span>Uptime</span>
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <div>
                    <span className="block font-bold text-base text-white">Next.js 15</span>
                    <span>Stack</span>
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <div>
                    <span className="block font-bold text-base text-white">&lt;1.2s</span>
                    <span>Latency</span>
                  </div>
                </div>

                <Link
                  href={`/projects/${projects[0].id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF462E] hover:bg-[#E63B24] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#FF462E]/25"
                >
                  <span>View Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stacked Complementary Cards (35% width) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {projects.slice(1, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex-1 bg-white/90 border border-[#ECE8DF] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between group hover:border-[#FF462E]/40 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF462E]">
                        {p.category}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#F5F2EB] group-hover:bg-[#FF462E] text-[#121214] group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#121214] tracking-tight mb-2 group-hover:text-[#FF462E] transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#666672] line-clamp-3 leading-relaxed mb-4">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[11px] font-medium text-[#4A4A57]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${p.id}`}
                      className="text-xs font-bold text-[#121214] group-hover:text-[#FF462E] inline-flex items-center gap-1"
                    >
                      Buka Detail Proyek →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
