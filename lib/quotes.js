/**
 * Cálculo de totales de una cotización. Se usa tanto en el formulario admin
 * como en la vista de detalle y el PDF — nunca se guardan los totales en la
 * base de datos, siempre se derivan de los ítems para evitar inconsistencias.
 */
export function calculateQuoteTotals(items = [], discount = 0, taxRate = 0) {
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0);
    return sum + Math.max(lineTotal, 0);
  }, 0);

  const afterDiscount = Math.max(subtotal - (discount || 0), 0);
  const tax = afterDiscount * ((taxRate || 0) / 100);
  const total = afterDiscount + tax;

  return {
    subtotal: round2(subtotal),
    discount: round2(discount || 0),
    afterDiscount: round2(afterDiscount),
    tax: round2(tax),
    total: round2(total),
  };
}

export function lineTotal(item) {
  return round2(Math.max((item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0), 0));
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export const CURRENCIES = ["USD", "PEN", "VES", "ARS", "BOB", "CLP", "COP", "MXN"];

const CURRENCY_LOCALE = {
  USD: "en-US",
  PEN: "es-PE",
  VES: "es-VE",
  ARS: "es-AR",
  BOB: "es-BO",
  CLP: "es-CL",
  COP: "es-CO",
  MXN: "es-MX",
};

export function formatMoney(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] || "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toFixed(2)}`;
  }
}

/** Formatea un mapa { USD: 500, PEN: 300 } como "$500.00 · S/300.00". */
export function formatMoneyByCurrency(amountsByCurrency = {}) {
  const entries = Object.entries(amountsByCurrency).filter(([, amount]) => amount > 0);
  if (entries.length === 0) return "—";
  return entries.map(([currency, amount]) => formatMoney(amount, currency)).join(" · ");
}

export const QUOTE_STATUSES = ["BORRADOR", "ENVIADA", "ACEPTADA", "RECHAZADA", "VENCIDA"];

const STATUS_LABELS = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
  ACEPTADA: "Aceptada",
  RECHAZADA: "Rechazada",
  VENCIDA: "Vencida",
};

export function quoteStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

const STATUS_STYLES = {
  BORRADOR: "bg-neutral-200 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300",
  ENVIADA: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  ACEPTADA: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  RECHAZADA: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  VENCIDA: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
};

export function quoteStatusStyle(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.BORRADOR;
}
