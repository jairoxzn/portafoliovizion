"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { contactSchema } from "@/schemas/contact";

/** Envío del formulario público de contacto. No requiere sesión. */
export async function createMessage(input) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  // Honeypot: si el campo oculto viene relleno, es un bot — respondemos éxito
  // sin guardar nada para no delatar la protección.
  if (parsed.data.website) {
    return { success: true };
  }

  const { website: _honeypot, ...data } = parsed.data;

  await prisma.message.create({ data });
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function listMessages() {
  await requireAdmin();
  return prisma.message.findMany({ orderBy: { createdAt: "desc" } });
}

export async function setMessageRead(id, read) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteMessage(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
