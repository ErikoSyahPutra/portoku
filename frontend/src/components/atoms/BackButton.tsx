"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  href?: string;
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({
  href = "/#projects",
  label = "Kembali ke Proyek",
  sublabel,
  onClick,
  className = "",
}: BackButtonProps) {
  const content = (
    <>
      <span className="w-8 h-8 rounded-full bg-[#F5F2EB] group-hover:bg-[#FF462E] text-[#121214] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-inner group-hover:scale-105 group-hover:-translate-x-0.5">
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
      <div className="flex flex-col items-start text-left">
        {sublabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#888899] group-hover:text-[#FF462E]/80 transition-colors duration-200">
            {sublabel}
          </span>
        )}
        <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#121214] group-hover:text-[#FF462E] transition-colors duration-200">
          {label}
        </span>
      </div>
    </>
  );

  const baseClasses = `group inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#FF462E]/40 shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-sm ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}

export default BackButton;
