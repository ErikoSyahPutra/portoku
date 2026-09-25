"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export interface QuoteCardProps {
  quote?: string;
  author?: string;
  role?: string;
  avatarUrl?: string;
  floating?: boolean;
  delay?: number;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote = "Eriko's exceptional full-stack craftsmanship and attention to detail transformed our web platform.",
  author = "Oliver Vance",
  role = "VP of Engineering",
  avatarUrl,
  floating = true,
  delay = 0.5,
  className = "",
}) => {
  const containerClasses = `relative max-w-xs sm:max-w-sm rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 hover:border-[#FF462E]/30 shadow-xl shadow-black/5 p-4 sm:p-5 select-none transition-colors duration-300 ${className}`;

  const content = (
    <>
      {/* Prominent Glowing Coral Quote Symbol */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFF1EE] to-[#FFE5E0] text-[#FF462E] flex items-center justify-center shrink-0 mb-3 shadow-sm shadow-[#FF462E]/30 ring-1 ring-[#FF462E]/20">
        <Quote className="w-4 h-4 fill-[#FF462E]" />
      </div>

      {/* Quote Body */}
      <p className="text-xs sm:text-sm text-[#0F0F11] font-medium leading-relaxed italic">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author & Attribution Footer */}
      {(author || role) && (
        <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center gap-2.5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author || "Client"}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-black/5 shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600 shrink-0">
              {author ? author.charAt(0).toUpperCase() : "C"}
            </div>
          )}
          <div className="flex flex-col text-left">
            {author && (
              <span className="text-xs font-semibold text-[#0F0F11] leading-tight">
                {author}
              </span>
            )}
            {role && (
              <span className="text-[10px] text-neutral-500 font-medium leading-tight">
                {role}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (floating) {
    return (
      <motion.div
        className={containerClasses}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4.5,
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

export default QuoteCard;
