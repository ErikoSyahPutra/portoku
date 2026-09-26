"use client";

import React from "react";

export type BadgeVariant = "default" | "coral" | "dark" | "subtle";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  floating?: boolean;
  delay?: number;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-white/90 backdrop-blur-sm text-[#0F0F11] border border-black/10 shadow-sm",
  coral:
    "bg-[#FFF1EE] text-[#FF462E] border border-[#FF462E]/20 shadow-sm",
  dark:
    "bg-[#0F0F11] text-white border border-white/10 shadow-sm",
  subtle:
    "bg-neutral-100 text-neutral-600 border border-neutral-200/60",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  floating = false,
  delay = 0,
  icon,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide select-none";
  const combinedClasses = `${baseClasses} ${variantStyles[variant]} ${className}`;

  if (floating) {
    return (
      <span
        className={`${combinedClasses} animate-badge-float`}
        style={delay ? { animationDelay: `${delay}s` } : undefined}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }

  return (
    <span className={combinedClasses}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
