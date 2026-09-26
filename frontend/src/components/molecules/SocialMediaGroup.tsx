"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Globe, Mail } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel?: string;
}

export interface SocialMediaGroupProps {
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  email?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "outline" | "white";
  customLinks?: SocialLinkItem[];
  className?: string;
}

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const variantStyles: Record<"dark" | "outline" | "white", string> = {
  dark: "bg-white/10 text-white hover:bg-[#FF462E] hover:text-white border border-white/15 hover:border-transparent shadow-sm",
  outline: "bg-white/90 text-[#0F0F11] hover:bg-[#FF462E] hover:text-white border border-black/10 hover:border-transparent shadow-sm",
  white: "bg-white text-[#0F0F11] hover:bg-[#FF462E] hover:text-white border border-black/5 hover:border-transparent shadow-md",
};

export const SocialMediaGroup: React.FC<SocialMediaGroupProps> = ({
  githubUrl = "https://github.com/ErikoSyahPutra",
  linkedinUrl = "https://linkedin.com/in/erikosyahputra",
  websiteUrl = "https://erikosyah.my.id",
  email = "erikosyahputra@gmail.com",
  size = "md",
  variant = "white",
  customLinks,
  className = "",
}) => {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

  const defaultLinks: SocialLinkItem[] = [
    ...(githubUrl
      ? [
          {
            name: "GitHub",
            url: githubUrl,
            icon: <Github size={iconSize} />,
            ariaLabel: "View GitHub Profile",
          },
        ]
      : []),
    ...(linkedinUrl
      ? [
          {
            name: "LinkedIn",
            url: linkedinUrl,
            icon: <Linkedin size={iconSize} />,
            ariaLabel: "View LinkedIn Profile",
          },
        ]
      : []),
    ...(websiteUrl
      ? [
          {
            name: "Website",
            url: websiteUrl,
            icon: <Globe size={iconSize} />,
            ariaLabel: "Visit Portfolio Website",
          },
        ]
      : []),
    ...(email
      ? [
          {
            name: "Email",
            url: email.startsWith("mailto:") ? email : `mailto:${email}`,
            icon: <Mail size={iconSize} />,
            ariaLabel: "Send Email to Eriko",
          },
        ]
      : []),
  ];

  const links = customLinks || defaultLinks;

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {links.map((link) => {
        const isMailto = link.url.startsWith("mailto:");
        return (
          <motion.div
            key={link.name}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <a
              href={link.url}
              target={isMailto ? undefined : "_blank"}
              rel={isMailto ? undefined : "noreferrer noopener"}
              aria-label={link.ariaLabel || link.name}
              className={`inline-flex items-center justify-center rounded-full select-none cursor-pointer transition-all duration-200 active:scale-95 ${sizeClasses[size]} ${variantStyles[variant]}`}
            >
              {link.icon}
            </a>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SocialMediaGroup;
