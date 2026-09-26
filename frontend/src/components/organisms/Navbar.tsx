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
  navItems = defaultNavItems,
  activeSection,
  onNavigate,
  className = "",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>(activeSection || "hero");

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = [
        "hero",
        "services",
        "about",
        "tech-stack",
        "projects",
        "experience",
        "blog",
        "contact",
      ];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
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
          ? "bg-[#FDFBF7]/98 md:backdrop-blur-md border-b border-[#ECE8DF] shadow-sm shadow-black/[0.03]"
          : "bg-[#FDFBF7]/92 md:backdrop-blur-sm border-b border-black/[0.04]"
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
              items={navItems}
              activeSection={currentSection}
              onNavigate={onNavigate}
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-black/10 bg-[#FDFBF7] shadow-xl ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 translate-y-0 visible pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="px-5 pt-4 pb-8 space-y-6">
          {/* Navigation Items */}
          <NavLinks
            items={navItems}
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
