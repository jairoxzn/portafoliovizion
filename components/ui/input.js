import { cn } from "@/lib/utils";

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-brand-electric/50 focus:border-brand-electric",
        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        error ? "border-red-500" : "border-border",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, error, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-brand-electric/50 focus:border-brand-electric",
        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-y",
        error ? "border-red-500" : "border-border",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border bg-surface px-3 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-brand-electric/50 focus:border-brand-electric",
        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        error ? "border-red-500" : "border-border",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, required, children, ...props }) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

export function FieldHint({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}
