import { randomUUID } from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { slugify } from "./slug";

/**
 * Adaptador de almacenamiento de archivos, con dos backends intercambiables:
 *
 * - Disco local (desarrollo): guarda en UPLOADS_DIR (por defecto
 *   "./storage/uploads"), fuera del árbol de Next.js, servido por
 *   app/api/uploads/[...path]/route.js.
 * - Vercel Blob (producción en Vercel): se activa automáticamente cuando
 *   existe BLOB_READ_WRITE_TOKEN (Vercel lo inyecta solo al conectar un
 *   Blob Store al proyecto). Las URLs son públicas y ya vienen de un CDN,
 *   así que no pasan por nuestra route handler.
 *
 * El resto de la app solo conoce `saveFile`/`deleteFile` y la URL devuelta
 * — nunca la ruta física ni el backend usado. Para migrar a S3/Cloudinary
 * más adelante, basta con agregar otro backend aquí.
 */

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const EXTENSION_BY_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function usesBlobStorage() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function buildFileName(originalName, mimeType) {
  const ext = EXTENSION_BY_MIME[mimeType] || "bin";
  const baseName = slugify(originalName.replace(/\.[^/.]+$/, "")) || "archivo";
  return `${randomUUID()}-${baseName}.${ext}`;
}

/**
 * Guarda un archivo y devuelve sus metadatos.
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} mimeType
 * @returns {Promise<{ url: string, name: string, type: string, size: number }>}
 */
export async function saveFile(buffer, originalName, mimeType) {
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`Tipo de archivo no permitido: ${mimeType}`);
  }
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error("El archivo supera el tamaño máximo permitido (5MB)");
  }

  const fileName = buildFileName(originalName, mimeType);

  if (usesBlobStorage()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${fileName}`, buffer, {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return { url: blob.url, name: fileName, type: mimeType, size: buffer.length };
  }

  const uploadsDir = getUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, fileName), buffer);

  return {
    url: `/api/uploads/${fileName}`,
    name: fileName,
    type: mimeType,
    size: buffer.length,
  };
}

/**
 * Elimina un archivo previamente guardado a partir de su URL pública.
 * Detecta el backend por la forma de la URL, no por el env var actual, para
 * poder limpiar archivos antiguos aunque el backend activo haya cambiado.
 */
export async function deleteFile(url) {
  if (!url) return;

  if (url.startsWith("/api/uploads/")) {
    return deleteLocalFile(url);
  }

  if (url.includes(".blob.vercel-storage.com/")) {
    try {
      const { del } = await import("@vercel/blob");
      await del(url);
    } catch {
      // El archivo ya podría no existir — no interrumpe la mutación.
    }
    return;
  }

  // URL externa (ej. imágenes de ejemplo del seed): no es nuestra, no se toca.
}

async function deleteLocalFile(url) {
  const fileName = path.basename(url);
  const uploadsDir = getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);

  if (!filePath.startsWith(uploadsDir)) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function getUploadsDir() {
  const dir = process.env.UPLOADS_DIR || "./storage/uploads";
  // turbopackIgnore: la ruta depende de una env var y vive fuera de /app,
  // así que no debe hacer que el tracer empaquete todo el proyecto.
  return path.isAbsolute(dir) ? dir : path.join(/* turbopackIgnore: true */ process.cwd(), dir);
}

/** Lee un archivo del storage local para servirlo desde la route handler. */
export async function readFile(fileName) {
  const safeName = path.basename(fileName);
  const uploadsDir = getUploadsDir();
  const filePath = path.join(uploadsDir, safeName);

  if (!filePath.startsWith(uploadsDir)) {
    throw new Error("Ruta de archivo inválida");
  }

  return fs.readFile(filePath);
}

export function extensionMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext] || "application/octet-stream";
}
