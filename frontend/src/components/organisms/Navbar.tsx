"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { NavLinks, defaultNavItems, NavItem } from "@/components/molecules/NavLinks";
import { SocialMediaGroup } from "@/components/molecules/SocialMediaGroup";
import { PortfolioProfile } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface NavbarProps {
  profile?: PortfolioProfile;
  navItems?: NavItem[];
  activeSection?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile = defaultPortfolioData.profile,
  navItems,
  activeSection,
  onNavigate,
  className = "",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>(activeSection || "hero");

  // Dynamically derive nav items based on admin profile visibility toggles
  const effectiveNavItems = React.useMemo(() => {
    if (navItems) {
      return navItems;
    }
    const items: NavItem[] = [
      { label: "Home", href: "#hero" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Tech Stack", href: "#tech-stack" },
    ];

    if (profile.showProjects !== false) {
      items.push({ label: "Projects", href: "#projects" });
    }

    if (profile.showExperiences !== false || profile.showAcademics !== false) {
      items.push({ label: "Experience", href: "#experience" });
    }

    if (profile.showBlog !== false) {
      items.push({ label: "Blog", href: "#blog" });
    }

    return items;
  }, [navItems, profile]);

  const sectionIds = React.useMemo(() => {
    return effectiveNavItems
      .map((item) => item.href.replace(/^#/, ""))
      .filter((id) => !id.startsWith("/") && !id.startsWith("http"));
  }, [effectiveNavItems]);

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection]);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      setCurrentSection(href.substring(1));
    }
    onNavigate?.(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // 1. If near the top of the page, always keep 'hero' active
      if (scrollY < 120) {
        setCurrentSection("hero");
        return;
      }

      // 2. If user scrolled to the bottom of the page, activate the last existing nav section
      const isAtBottom =
        scrollY > 300 &&
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60;

      if (isAtBottom && sectionIds.length > 0) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          if (document.getElementById(sectionIds[i])) {
            setCurrentSection(sectionIds[i]);
            return;
          }
        }
      }

      // 3. Find which section is currently in view under the navbar
      const navThreshold = 180;
      let active = "hero";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navThreshold && rect.bottom > 80) {
            active = id;
          }
        }
      }

      setCurrentSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const handleMobileNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      setCurrentSection(targetId);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const navOffset = 70;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        }
      }, 50);
    }
    onNavigate?.(href);
  };

  const firstName = profile.name.split(" ")[0] || "Eriko";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/[0.08] shadow-sm shadow-black/[0.03]"
          : "bg-white/75 backdrop-blur-md border-b border-black/[0.06] shadow-xs"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F11] group select-none"
            aria-label={`${profile.name} Portfolio Home`}
          >
            <span>{firstName}</span>
            <span className="text-[#FF462E] transition-transform duration-300 group-hover:scale-125">
              .
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center">
            <NavLinks
              items={effectiveNavItems}
              activeSection={currentSection}
              onNavigate={handleNavClick}
              className="bg-black/[0.03] border border-black/5 px-3 py-1.5 rounded-full"
            />
          </div>

          {/* Right Action Area (Desktop CTA) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href="#contact"
              variant="primary"
              size="md"
              icon={<ArrowUpRight size={16} />}
              iconPosition="right"
              onClick={() => onNavigate?.("#contact")}
            >
              Contact Me
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-xl text-[#0F0F11] hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF462E]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown - Pure CSS GPU-accelerated transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-black/[0.08] bg-white/95 backdrop-blur-xl shadow-2xl ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 translate-y-0 visible pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="px-5 pt-4 pb-8 space-y-6">
          {/* Navigation Items */}
          <NavLinks
            items={effectiveNavItems}
            activeSection={currentSection}
            orientation="vertical"
            onNavigate={handleMobileNavClick}
            itemClassName="text-base py-2.5 px-4 font-medium"
          />

          {/* Mobile CTA */}
          <div className="pt-2 border-t border-black/5 flex flex-col gap-4">
            <Button
              href="#contact"
              variant="primary"
              size="md"
              icon={<ArrowUpRight size={16} />}
              iconPosition="right"
              className="w-full justify-center"
              onClick={() => handleMobileNavClick("#contact")}
            >
              Contact Me
            </Button>

            {/* Social Media Links */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500 font-medium">Follow along:</span>
              <SocialMediaGroup
                githubUrl={profile.githubUrl}
                linkedinUrl={profile.linkedinUrl}
                websiteUrl={profile.websiteUrl}
                email={profile.email}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
