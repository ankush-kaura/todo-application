import { type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const variants = {
  default: "bg-bg-tertiary text-text-secondary",
  primary: "bg-primary-light text-primary",
  danger: "bg-danger-light text-danger",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
};

const sizes = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
