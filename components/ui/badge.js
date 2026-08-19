import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-surface-muted text-foreground border border-border",
  brand: "bg-brand-electric/10 text-brand-electric border border-brand-electric/20",
  outline: "border border-border text-muted-foreground",
};

export function Badge({ variant = "default", className, style, children }) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
