import { z } from "zod";
import { CURRENCIES } from "@/lib/quotes";

export const QUOTE_STATUSES = ["BORRADOR", "ENVIADA", "ACEPTADA", "RECHAZADA", "VENCIDA"];

export const quoteItemSchema = z.object({
  description: z.string().trim().min(1, "Descripción requerida").max(200),
  quantity: z.coerce.number().min(0.01, "Cantidad debe ser mayor a 0").default(1),
  unitPrice: z.coerce.number().min(0, "Precio no puede ser negativo"),
  discount: z.coerce.number().min(0, "Descuento no puede ser negativo").default(0),
});

export const quoteSchema = z.object({
  clientId: z.string().trim().min(1, "Selecciona un cliente"),
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres").max(160),
  description: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres"),
  status: z.enum(QUOTE_STATUSES).default("BORRADOR"),
  currency: z.enum(CURRENCIES).default("USD"),
  discount: z.coerce.number().min(0, "Descuento no puede ser negativo").default(0),
  taxRate: z.coerce.number().min(0, "El impuesto no puede ser negativo").max(100).default(0),
  validUntil: z.string().trim().optional().default(""),
  scopeIncludes: z.array(z.string().trim().min(1)).default([]),
  scopeExcludes: z.array(z.string().trim().min(1)).default([]),
  paymentTerms: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(3000).optional().default(""),
  items: z.array(quoteItemSchema).min(1, "Agrega al menos un ítem"),
});
