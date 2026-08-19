import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((val) => val === "" || /^https?:\/\/.+/i.test(val), {
    message: "Debe ser una URL válida (http:// o https://)",
  });

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1, "El nombre de la empresa es requerido").max(120),
  logo: z.string().trim().optional().default(""),
  description: z.string().trim().max(500).optional().default(""),
  email: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Email inválido",
    }),
  phone: z.string().trim().max(30).optional().default(""),
  whatsapp: z.string().trim().max(30).optional().default(""),
  address: z.string().trim().max(200).optional().default(""),
  schedule: z.string().trim().max(200).optional().default(""),
  facebook: optionalUrl,
  instagram: optionalUrl,
  tiktok: optionalUrl,
  linkedin: optionalUrl,
  github: optionalUrl,
});
