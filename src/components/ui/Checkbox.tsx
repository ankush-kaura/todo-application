import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              "peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-border bg-surface",
              "transition-all duration-200 checked:border-primary checked:bg-primary checked:shadow-sm checked:shadow-primary/25",
              "hover:border-primary/60",
              "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />
          <svg
            className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 peer-checked:animate-check-pop"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {label && (
          <label
            htmlFor={id}
            className="cursor-pointer text-sm text-text-primary select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
