import {
  type TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useId,
} from "react";
import { cn } from "@/utils/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  autoGrow?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      autoGrow = true,
      id: idProp,
      onInput,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const handleInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        if (autoGrow) {
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }
        onInput?.(e);
      },
      [autoGrow, onInput],
    );

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          onInput={handleInput}
          className={cn(
            "min-h-[80px] rounded-lg border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
            "resize-none transition-colors focus:border-border-focus focus:ring-2 focus:ring-primary/20 focus:outline-none",
            error ? "border-danger" : "border-border",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
