"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface SpinningBadgeProps {
  text?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  size?: number;
  centerIcon?: React.ReactNode;
  ariaLabel?: string;
}

export const SpinningBadge: React.FC<SpinningBadgeProps> = ({
  text = "✦ HIRE ME ✦ AVAILABLE NOW ✦ HIRE ME ✦ AVAILABLE NOW ",
  href = "#contact",
  onClick,
  className = "",
  size = 130,
  centerIcon,
  ariaLabel = "Hire Me - Available Now",
}) => {
  const rawId = useId();
  const pathId = `spinning-text-path-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [isHovered, setIsHovered] = useState(false);

  const centerSize = Math.round(size * 0.38);

  const innerContent = (
    <motion.div
      className={`group relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Rotating SVG text ring */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: isHovered ? 7 : 14,
        }}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <path
              id={pathId}
              d="M 80, 80 m -54, 0 a 54, 54 0 1, 1 108, 0 a 54, 54 0 1, 1 -108, 0"
            />
          </defs>
          <text className="text-[10px] uppercase font-bold tracking-[0.18em] fill-[#0F0F11]">
            <textPath
              href={`#${pathId}`}
              xlinkHref={`#${pathId}`}
              startOffset="0%"
              textLength="336"
              lengthAdjust="spacing"
            >
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Center circle badge with icon */}
      <div
        className="relative z-10 rounded-full bg-white group-hover:bg-[#FF462E] text-[#0F0F11] group-hover:text-white border border-black/10 group-hover:border-[#FF462E] shadow-sm flex items-center justify-center transition-all duration-300"
        style={{ width: centerSize, height: centerSize }}
      >
        <div className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {centerIcon || <ArrowUpRight size={Math.round(centerSize * 0.46)} strokeWidth={2.4} />}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className="inline-block"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-block bg-transparent border-0 p-0"
    >
      {innerContent}
    </button>
  );
};

export default SpinningBadge;
