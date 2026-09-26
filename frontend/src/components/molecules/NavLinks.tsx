"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  href: string;
}

export const defaultNavItems: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Blog", href: "#blog" },
];

export interface NavLinksProps {
  items?: NavItem[];
  activeSection?: string;
  onNavigate?: (href: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  itemClassName?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  items = defaultNavItems,
  activeSection,
  onNavigate,
  orientation = "horizontal",
  className = "",
  itemClassName = "",
}) => {
  const handleClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      onNavigate?.(href);

      // Perform smooth scroll after a tiny delay so mobile drawer closing doesn't disrupt scroll
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
      return;
    }

    onNavigate?.(href);
  };

  const isItemActive = (item: NavItem, index: number): boolean => {
    if (!activeSection) {
      return index === 0;
    }
    const cleanActive = activeSection.replace(/^#/, "").toLowerCase();
    const cleanHref = item.href.replace(/^#/, "").replace(/^\//, "").toLowerCase();
    const cleanLabel = item.label.toLowerCase();

    return (
      cleanActive === cleanHref ||
      cleanActive === cleanLabel ||
      activeSection === item.href
    );
  };

  const listClasses =
    orientation === "horizontal"
      ? `flex items-center gap-1 sm:gap-1.5 ${className}`
      : `flex flex-col gap-1 w-full ${className}`;

  return (
    <nav className={listClasses} aria-label="Main Navigation">
      {items.map((item, index) => {
        const active = isItemActive(item, index);
        const isExternalOrPage = item.href.startsWith("/") || item.href.startsWith("http");

        const linkContent = (
          <>
            <span>{item.label}</span>
            {active && (
              orientation === "horizontal" ? (
                <motion.span
                  layoutId="navActiveDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#FF462E] shrink-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF462E] shrink-0" />
              )
            )}
          </>
        );

        const sharedClasses = `relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm tracking-tight transition-all duration-200 select-none ${
          active
            ? "text-[#0F0F11] font-semibold bg-black/[0.04]"
            : "text-neutral-600 hover:text-[#0F0F11] hover:bg-black/[0.03] font-medium"
        } ${itemClassName}`;

        if (isExternalOrPage && !item.href.startsWith("#")) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={sharedClasses}
              aria-current={active ? "page" : undefined}
            >
              {linkContent}
            </Link>
          );
        }

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={sharedClasses}
            aria-current={active ? "location" : undefined}
          >
            {linkContent}
          </a>
        );
      })}
    </nav>
  );
};

export default NavLinks;
