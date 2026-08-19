"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal genérico basado en <dialog> nativo, para formularios (crear/editar
 * categoría, tecnología, etc.).
 */
export function Modal({ open, onClose, title, children, className }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose?.();
      }}
      className={cn(
        "m-auto w-full max-w-lg rounded-xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
    </dialog>
  );
}
