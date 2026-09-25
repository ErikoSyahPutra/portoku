import React from "react";
import { Sparkles } from "lucide-react";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  highlightWord?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  hasSparkle?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  highlightWord,
  description,
  align = "left",
  className = "",
  hasSparkle = false,
}) => {
  const isCenter = align === "center";

  // Helper to highlight a specific word in string titles
  const renderTitle = () => {
    if (typeof title !== "string" || !highlightWord) {
      return title;
    }

    const regex = new RegExp(`(${highlightWord})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={index} className="text-[#FF462E]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`flex flex-col ${
        isCenter ? "items-center text-center mx-auto" : "items-start text-left"
      } ${className}`}
    >
      {/* Eyebrow / Subtitle badge */}
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3">
          {hasSparkle && (
            <Sparkles size={14} className="text-[#FF462E] shrink-0 animate-pulse" />
          )}
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FF462E]">
            {eyebrow}
          </span>
        </div>
      )}

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F11] leading-[1.15]">
        {renderTitle()}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={`mt-4 text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed ${
            isCenter ? "max-w-2xl mx-auto" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
