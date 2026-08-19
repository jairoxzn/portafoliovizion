"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { settingsSchema } from "@/schemas/settings";

const SETTINGS_ID = "settings";

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  if (settings) return settings;

  // Crea el registro singleton con valores por defecto si aún no existe.
  return prisma.settings.create({
    data: { id: SETTINGS_ID, companyName: "viziontech" },
  });
}

export async function updateSettings(input) {
  await requireAdmin();

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const settings = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: parsed.data,
    create: { id: SETTINGS_ID, ...parsed.data },
  });

  revalidatePath("/admin/configuracion");
  revalidatePath("/", "layout");

  return { success: true, data: settings };
}
