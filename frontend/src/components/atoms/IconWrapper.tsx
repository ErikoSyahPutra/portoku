import React from "react";

export type IconShape = "none" | "circle" | "rounded" | "square";

export interface IconWrapperProps {
  icon: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
  shape?: IconShape;
  background?: string;
  ariaLabel?: string;
}

const shapeStyles: Record<IconShape, string> = {
  none: "",
  circle: "rounded-full border border-black/5 shadow-xs p-2",
  rounded: "rounded-xl border border-black/5 shadow-xs p-2",
  square: "rounded-md border border-black/5 shadow-xs p-2",
};

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  size = 20,
  color,
  className = "",
  shape = "none",
  background,
  ariaLabel,
}) => {
  const style: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...(background ? { backgroundColor: background } : {}),
  };

  // If icon is a valid React element, safely forward size and color if not already specified
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(
        icon as React.ReactElement<{ size?: number; color?: string }>,
        {
          ...(size && !(icon.props as { size?: number }).size ? { size } : {}),
          ...(color && !(icon.props as { color?: string }).color ? { color } : {}),
        }
      )
    : icon;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${shapeStyles[shape]} ${className}`}
      style={style}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      {renderedIcon}
    </span>
  );
};

export default IconWrapper;
