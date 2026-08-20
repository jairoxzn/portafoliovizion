import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(160),
  taxId: z.string().trim().max(40).optional().default(""),
  contactName: z.string().trim().max(120).optional().default(""),
  contactRole: z.string().trim().max(80).optional().default(""),
  phone: z.string().trim().max(30).optional().default(""),
  whatsapp: z.string().trim().max(30).optional().default(""),
  email: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Email inválido",
    }),
  address: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});
