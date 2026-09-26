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
  onClick,
  className = "",
}: BackButtonProps) {
  const content = (
    <>
      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5F2EB] group-hover:bg-[#0F0F11] text-[#121214] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-xs">
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      </span>
      <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#121214] group-hover:text-[#FF462E] transition-colors duration-200 pr-1">
        {label}
      </span>
    </>
  );

  const baseClasses = `group inline-flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 pr-3.5 sm:pr-4 py-1 sm:py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#ECE8DF] hover:border-[#121214]/25 shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-sm select-none ${className}`;

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
