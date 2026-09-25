"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { PortfolioService } from "@/types/portfolio";

export interface ServiceAccordionItemProps {
  service: PortfolioService;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const ServiceAccordionItem: React.FC<ServiceAccordionItemProps> = ({
  service,
  isOpen,
  onToggle,
  className = "",
}) => {
  const formattedNumber = service.number.endsWith(".")
    ? service.number
    : `${service.number}.`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`group relative w-full rounded-2xl md:rounded-3xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-[#0F0F11] text-white border border-white/10 shadow-2xl"
          : "bg-[#FDFBF7] text-[#0F0F11] border border-black/10 hover:border-black/20 hover:bg-[#F9F7F1]"
      } ${className}`}
    >
      {/* Accordion Header / Trigger Bar */}
      <button
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`service-panel-${service.id}`}
        id={`service-header-${service.id}`}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-7 text-left select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF462E] transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          {/* Service Index Number */}
          <span
            className={`font-mono text-sm md:text-base font-semibold tracking-wider shrink-0 transition-colors ${
              isOpen
                ? "text-[#FF462E]"
                : "text-neutral-400 group-hover:text-[#FF462E]"
            }`}
          >
            {formattedNumber}
          </span>

          {/* Service Title */}
          <h3
            className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate transition-colors ${
              isOpen
                ? "text-white"
                : "text-[#0F0F11] group-hover:text-[#FF462E]"
            }`}
          >
            {service.title}
          </h3>
        </div>

        {/* Circular Arrow Toggle Button */}
        <div
          className={`shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-[#FF462E] text-white shadow-md shadow-[#FF462E]/30"
              : "border border-black/10 bg-white text-[#0F0F11] group-hover:border-[#FF462E] group-hover:bg-[#FFF1EE] group-hover:text-[#FF462E]"
          }`}
        >
          <ArrowUpRight
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
              isOpen ? "rotate-90" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }`}
          />
        </div>
      </button>

      {/* Expanded Stylized Content Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`service-panel-${service.id}`}
            role="region"
            aria-labelledby={`service-header-${service.id}`}
            key="accordion-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-6 md:pb-8 px-5 md:px-8 border-t border-white/10 mt-1 md:mt-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
                {/* Left: Tags & Description */}
                <div className="flex-1 space-y-4">
                  {/* Tag Badges */}
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="dark"
                          className="bg-white/10 text-white/90 border border-white/15 hover:bg-white/20 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Service Description */}
                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>

                {/* Right: Chamfered Preview Thumbnail */}
                {service.previewImage && (
                  <div className="relative w-full lg:w-72 xl:w-80 h-44 sm:h-48 rounded-2xl overflow-hidden border border-white/15 shrink-0 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)] group/img shadow-xl">
                    <img
                      src={service.previewImage}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white/80 border border-white/10">
                      PREVIEW
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceAccordionItem;
