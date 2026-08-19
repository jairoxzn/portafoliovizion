"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: "border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  error: "border-red-500/30 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300",
  info: "border-brand-electric/30 bg-brand-electric/5 text-brand-cobalt dark:text-brand-electric",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "info", title, description, duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, title, description }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map(({ id, type, title, description }) => {
          const Icon = ICONS[type] || Info;
          return (
            <div
              key={id}
              role="status"
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all",
                STYLES[type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {title && <p className="text-sm font-semibold">{title}</p>}
                {description && <p className="text-sm opacity-90">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="shrink-0 opacity-60 hover:opacity-100"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
