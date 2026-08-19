import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
  email: z.string().trim().min(1, "El email es requerido").email("Email inválido"),
  phone: z.string().trim().max(30).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  subject: z.string().trim().max(160).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(4000, "El mensaje es demasiado largo"),
  // honeypot anti-spam: si viene relleno, se descarta silenciosamente
  website: z.string().max(0, "").optional().default(""),
});
