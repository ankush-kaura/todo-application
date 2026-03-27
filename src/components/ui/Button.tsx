import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-primary text-text-inverse hover:bg-primary-hover focus-visible:ring-primary",
  secondary:
    "bg-bg-tertiary text-text-primary hover:bg-border focus-visible:ring-primary",
  ghost:
    "bg-transparent text-text-primary hover:bg-bg-tertiary focus-visible:ring-primary",
  danger:
    "bg-danger text-white hover:bg-danger-hover focus-visible:ring-danger",
};

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
