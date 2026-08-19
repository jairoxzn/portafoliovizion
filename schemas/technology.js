import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(60),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener minúsculas, números y guiones"),
  icon: z.string().trim().max(60).optional().default(""),
  color: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((val) => val === "" || /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val), {
      message: "Color hex inválido (ej. #00AEEF)",
    }),
  active: z.coerce.boolean().default(true),
});
