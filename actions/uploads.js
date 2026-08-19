"use server";

import { requireAdmin } from "@/lib/session";
import { saveFile, deleteFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/storage";

/**
 * Sube una imagen desde un <input type="file"> del panel admin.
 * @param {FormData} formData con un campo "file"
 */
export async function uploadImage(formData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return { success: false, error: "No se recibió ningún archivo." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "Formato no permitido. Usa JPG, PNG, WEBP o GIF." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "El archivo supera el tamaño máximo de 5MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await saveFile(buffer, file.name, file.type);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message || "No se pudo subir el archivo." };
  }
}

export async function removeUploadedImage(url) {
  await requireAdmin();
  try {
    await deleteFile(url);
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo eliminar el archivo." };
  }
}
