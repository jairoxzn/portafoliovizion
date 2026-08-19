import { z } from "zod";

export const PROJECT_STATUSES = [
  "EN_DESARROLLO",
  "COMPLETADO",
  "MANTENIMIENTO",
  "DEMO",
  "ARCHIVADO",
];

export const LINK_TYPES = [
  "DEMO",
  "SISTEMA",
  "LANDING_PAGE",
  "REPOSITORIO",
  "DOCUMENTACION",
  "OTRO",
];

export const projectLinkSchema = z.object({
  name: z.string().trim().min(1, "El nombre del enlace es requerido").max(60),
  url: z.string().trim().min(1, "La URL es requerida").regex(/^https?:\/\/.+/i, "URL inválida"),
  type: z.enum(LINK_TYPES).default("OTRO"),
});

export const projectImageSchema = z.object({
  url: z.string().trim().min(1, "URL de imagen requerida"),
  alt: z.string().trim().max(160).optional().default(""),
  order: z.coerce.number().int().min(0).default(0),
});

export const projectSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener minúsculas, números y guiones"),
  shortDescription: z
    .string()
    .trim()
    .min(10, "La descripción corta debe tener al menos 10 caracteres")
    .max(220),
  description: z.string().trim().min(20, "La descripción debe tener al menos 20 caracteres"),
  problem: z.string().trim().max(2000).optional().default(""),
  features: z.array(z.string().trim().min(1)).default([]),
  client: z.string().trim().max(120).optional().default(""),
  categoryId: z.string().trim().min(1, "Selecciona una categoría"),
  mainImage: z.string().trim().optional().default(""),
  status: z.enum(PROJECT_STATUSES).default("EN_DESARROLLO"),
  published: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  developmentDate: z.string().trim().optional().default(""),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(160).optional().default(""),
  metaKeywords: z.string().trim().max(200).optional().default(""),
  technologyIds: z.array(z.string()).default([]),
  images: z.array(projectImageSchema).default([]),
  links: z.array(projectLinkSchema).default([]),
});

export const projectFilterSchema = z.object({
  q: z.string().trim().optional().default(""),
  category: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default(""),
});
