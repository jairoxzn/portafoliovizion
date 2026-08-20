"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { clientSchema } from "@/schemas/client";

export async function listClients() {
  await requireAdmin();
  return prisma.client.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { quotes: true } } },
  });
}

export async function getClientById(id) {
  await requireAdmin();
  return prisma.client.findUnique({ where: { id } });
}

export async function createClient(input) {
  await requireAdmin();

  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const client = await prisma.client.create({ data: parsed.data });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin/cotizaciones");
  return { success: true, data: client };
}

export async function updateClient(id, input) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const client = await prisma.client.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/clientes");
  revalidatePath("/admin/cotizaciones");
  return { success: true, data: client };
}

export async function deleteClient(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const quoteCount = await prisma.quote.count({ where: { clientId: id } });
  if (quoteCount > 0) {
    return {
      success: false,
      error: `No se puede eliminar: tiene ${quoteCount} cotización(es) asociada(s).`,
    };
  }

  await prisma.client.delete({ where: { id } });
  revalidatePath("/admin/clientes");
  return { success: true };
}
