"use client";

import React, { forwardRef } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "dark" | "outline" | "white" | "icon-circle";
export type ButtonSize = "sm" | "md" | "lg";
export type IconPosition = "left" | "right";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  ariaLabel?: string;
  download?: boolean | string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#FF462E] hover:bg-[#E63B24] text-white font-medium rounded-full shadow-md shadow-[#FF462E]/25 transition-all duration-200 active:scale-95 border border-transparent",
  dark:
    "bg-[#0F0F11] hover:bg-[#1A1A1E] text-white font-medium rounded-full border border-white/10 shadow-sm transition-all duration-200 active:scale-95",
  outline:
    "bg-white/80 hover:bg-white text-[#121214] font-medium rounded-full border border-black/10 hover:border-black/20 shadow-sm transition-all duration-200 active:scale-95",
  white:
    "bg-white hover:bg-neutral-50 text-[#0F0F11] font-medium rounded-full border border-neutral-200/80 shadow-sm transition-all duration-200 active:scale-95",
  "icon-circle":
    "bg-white hover:bg-[#FF462E] hover:text-white text-[#0F0F11] rounded-full border border-black/10 hover:border-transparent shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center p-0",
};

const sizeStyles: Record<ButtonSize, Record<ButtonVariant, string>> = {
  sm: {
    primary: "text-xs px-3.5 py-1.5 gap-1.5",
    dark: "text-xs px-3.5 py-1.5 gap-1.5",
    outline: "text-xs px-3.5 py-1.5 gap-1.5",
    white: "text-xs px-3.5 py-1.5 gap-1.5",
    "icon-circle": "w-8 h-8 text-xs",
  },
  md: {
    primary: "text-sm px-5 py-2.5 gap-2",
    dark: "text-sm px-5 py-2.5 gap-2",
    outline: "text-sm px-5 py-2.5 gap-2",
    white: "text-sm px-5 py-2.5 gap-2",
    "icon-circle": "w-10 h-10 text-sm",
  },
  lg: {
    primary: "text-base px-7 py-3.5 gap-2.5",
    dark: "text-base px-7 py-3.5 gap-2.5",
    outline: "text-base px-7 py-3.5 gap-2.5",
    white: "text-base px-7 py-3.5 gap-2.5",
    "icon-circle": "w-12 h-12 text-base",
  },
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      href,
      onClick,
      icon,
      iconPosition = "right",
      className = "",
      disabled = false,
      type = "button",
      target,
      rel,
      ariaLabel,
      download,
    },
    ref
  ) => {
    const isIconOnly = variant === "icon-circle" || (!children && Boolean(icon));
    const baseClasses = isIconOnly
      ? "inline-flex items-center justify-center shrink-0 cursor-pointer select-none"
      : "inline-flex items-center justify-center select-none cursor-pointer tracking-tight";

    const disabledClasses = disabled
      ? "opacity-50 pointer-events-none cursor-not-allowed active:scale-100"
      : "";

    const combinedClasses = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size][variant],
      disabledClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === "right" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
      </>
    );

    if (href && !disabled) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          onClick={onClick}
          className={combinedClasses}
          aria-label={ariaLabel}
          target={target ?? (isExternal ? "_blank" : undefined)}
          rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
          download={download}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={combinedClasses}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
