"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export interface RatingBadgeProps {
  ratingScore?: string;
  reviewsCount?: string;
  reviewsLabel?: string;
  avatars?: string[];
  floating?: boolean;
  delay?: number;
  className?: string;
}

const defaultAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=120&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120&auto=format&fit=crop",
];

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  ratingScore = "4.9 of 5",
  reviewsCount = "150+ Reviews",
  reviewsLabel = "Reviews from Valued Clients",
  avatars = defaultAvatars,
  floating = true,
  delay = 0,
  className = "",
}) => {
  const containerClasses = `inline-flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-lg shadow-black/[0.04] select-none ${className}`;

  const content = (
    <>
      {/* Overlapping Client Avatars */}
      <div className="flex -space-x-2 shrink-0">
        {avatars.slice(0, 4).map((avatarUrl, index) => (
          <img
            key={index}
            src={avatarUrl}
            alt={`Client ${index + 1}`}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
            loading="lazy"
          />
        ))}
      </div>

      {/* Review Metrics */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800] shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-[#0F0F11] tracking-tight">
            {reviewsCount}
          </span>
          <span className="text-[11px] sm:text-xs text-neutral-500 font-normal">
            ({ratingScore})
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium tracking-tight leading-none mt-1">
          {reviewsLabel}
        </p>
      </div>
    </>
  );

  if (floating) {
    return (
      <motion.div
        className={containerClasses}
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default RatingBadge;
