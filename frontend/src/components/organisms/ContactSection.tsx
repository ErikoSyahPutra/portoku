"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SocialMediaGroup } from "@/components/molecules/SocialMediaGroup";
import { PortfolioProfile } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface ContactSectionProps {
  profile?: PortfolioProfile;
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile = defaultPortfolioData.profile,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("submitting");

    // Simulate instant responsive submission / feedback
    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const firstName = profile.name.split(" ")[0] || "Eriko";

  return (
    <section
      id="contact"
      aria-label="Contact and Inquiries"
      className={`pt-20 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}
    >
      {/* Main Contact Container */}
      <div className="rounded-3xl md:rounded-[36px] bg-[#0F0F11] text-white p-6 sm:p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden mb-16">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-[#FF462E]/15 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Big Headline, Info Badges & Social Links */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[#FF462E]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FF462E]">
                  — Let&apos;s Connect
                </span>
              </div>

              {/* Big CTA Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Let&apos;s Bring Your{" "}
                <span className="text-[#FF462E]">Ideas to Life</span>
              </h2>

              <p className="mt-5 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md">
                Have an ambitious product to launch, a web system that needs
                scaling, or an open engineering role? Send a message and let&apos;s discuss.
              </p>

              {/* Direct Info Pills */}
              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FF462E]/50 hover:bg-white/[0.08] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF462E]/15 text-[#FF462E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                      Email Directly
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-[#FF462E] transition-colors">
                      {profile.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                      Based In
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {profile.location} (UTC+7)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block mb-3">
                Social Profiles:
              </span>
              <SocialMediaGroup
                githubUrl={profile.githubUrl}
                linkedinUrl={profile.linkedinUrl}
                websiteUrl={profile.websiteUrl}
                email={profile.email}
                size="md"
                variant="dark"
              />
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Send a Direct Message
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mb-6">
              Fill out the form below. I usually respond within 24 hours.
            </p>

            {formStatus === "success" ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-bold text-white">
                  Message Sent Successfully!
                </h4>
                <p className="text-neutral-300 text-sm max-w-sm">
                  Thank you for reaching out. I will review your message and get
                  back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setFormStatus("idle")}
                  className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
                    >
                      Your Name <span className="text-[#FF462E]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF462E] focus:ring-1 focus:ring-[#FF462E] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
                    >
                      Email Address <span className="text-[#FF462E]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF462E] focus:ring-1 focus:ring-[#FF462E] transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry, Consultation, or Hiring"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF462E] focus:ring-1 focus:ring-[#FF462E] transition-colors"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
                  >
                    Your Message <span className="text-[#FF462E]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FF462E] focus:ring-1 focus:ring-[#FF462E] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formStatus === "submitting"}
                    icon={
                      formStatus === "submitting" ? undefined : (
                        <Send size={16} />
                      )
                    }
                    iconPosition="right"
                    className="w-full justify-center shadow-lg shadow-[#FF462E]/25 py-3.5"
                  >
                    {formStatus === "submitting"
                      ? "Sending Message..."
                      : "Send Message"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2 select-none">
          <Link
            href="/"
            className="font-bold text-lg text-[#0F0F11] tracking-tight group"
          >
            <span>{firstName}</span>
            <span className="text-[#FF462E]">.</span>
          </Link>
          <span className="text-neutral-400">|</span>
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
        </div>

        {/* Quick Nav Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6">
          <a
            href="#hero"
            className="hover:text-[#0F0F11] transition-colors font-medium text-xs sm:text-sm"
          >
            Home
          </a>
          <a
            href="#services"
            className="hover:text-[#0F0F11] transition-colors font-medium text-xs sm:text-sm"
          >
            Services
          </a>
          <a
            href="#about"
            className="hover:text-[#0F0F11] transition-colors font-medium text-xs sm:text-sm"
          >
            About
          </a>
          <a
            href="#projects"
            className="hover:text-[#0F0F11] transition-colors font-medium text-xs sm:text-sm"
          >
            Projects
          </a>
          <Link
            href="/blog"
            className="hover:text-[#0F0F11] transition-colors font-medium text-xs sm:text-sm"
          >
            Blog
          </Link>

          {/* Scroll to Top Trigger */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-8 h-8 rounded-full border border-black/10 hover:border-[#FF462E] hover:bg-[#FFF1EE] hover:text-[#FF462E] flex items-center justify-center transition-all cursor-pointer ml-2"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;
