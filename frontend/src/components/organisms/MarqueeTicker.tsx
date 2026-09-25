"use client";

import React from "react";
import { motion } from "framer-motion";
import { defaultPortfolioData } from "@/data/portfolioData";

export interface MarqueeTickerProps {
  items?: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items = defaultPortfolioData.marqueeItems,
  speed = 28,
  direction = "left",
  className = "",
}) => {
  // Triple the items array to ensure flawless, infinite wrapping on any viewport width
  const loopedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-label="Technology and Skill Highlights"
      className={`relative w-full bg-[#0F0F11] text-white py-4 sm:py-5 border-y border-white/10 overflow-hidden select-none ${className}`}
    >
      {/* Edge gradient masks for subtle fade-in and fade-out */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0F0F11] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0F0F11] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max">
        <motion.div
          className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10 will-change-transform"
          animate={{
            x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: speed,
          }}
        >
          {loopedItems.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-6 sm:gap-10">
              <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase text-neutral-200 hover:text-white transition-colors">
                {item}
              </span>
              <span
                className="text-[#FF462E] text-sm sm:text-base font-bold select-none drop-shadow-[0_0_8px_rgba(255,70,46,0.6)]"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeTicker;
