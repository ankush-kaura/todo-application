import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-text-tertiary [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
