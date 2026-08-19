import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind evitando conflictos (clsx + tailwind-merge). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Formatea una fecha a "enero 2025" / "12 ene 2025" en español. */
export function formatDate(date, options = { year: "numeric", month: "long" }) {
  if (!date) return null;
  return new Intl.DateTimeFormat("es", options).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const STATUS_LABELS = {
  EN_DESARROLLO: "En desarrollo",
  COMPLETADO: "Completado",
  MANTENIMIENTO: "Mantenimiento",
  DEMO: "Demo",
  ARCHIVADO: "Archivado",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

const STATUS_STYLES = {
  EN_DESARROLLO: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  COMPLETADO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  MANTENIMIENTO: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  DEMO: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  ARCHIVADO: "bg-neutral-200 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300",
};

export function statusStyle(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.ARCHIVADO;
}

const LINK_TYPE_LABELS = {
  DEMO: "Demo",
  SISTEMA: "Sistema",
  LANDING_PAGE: "Landing Page",
  REPOSITORIO: "Repositorio",
  DOCUMENTACION: "Documentación",
  OTRO: "Otro",
};

export function linkTypeLabel(type) {
  return LINK_TYPE_LABELS[type] ?? type;
}

/** Trunca un texto a `max` caracteres agregando "…" */
export function truncate(text, max = 140) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
