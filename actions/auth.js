"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { profileSchema, changePasswordSchema } from "@/schemas/auth";

export async function updateProfile(input) {
  const admin = await requireAdmin();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
      },
    });
    revalidatePath("/admin/perfil");
    return { success: true };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ese email ya está en uso." };
    }
    return { success: false, error: "No se pudo actualizar el perfil." };
  }
}

export async function changePassword(input) {
  const admin = await requireAdmin();

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user) {
    return { success: false, error: "Usuario no encontrado." };
  }

  const matches = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!matches) {
    return { success: false, error: "La contraseña actual es incorrecta." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: admin.id }, data: { passwordHash } });

  return { success: true };
}
