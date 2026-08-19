import { randomUUID } from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { slugify } from "./slug";

/**
 * Adaptador de almacenamiento de archivos.
 *
 * Implementación actual: disco local, en una carpeta FUERA del árbol de código
 * fuente de Next.js (definida por UPLOADS_DIR, por defecto "./storage/uploads"),
 * servida a través de la route handler app/api/uploads/[...path]/route.js.
 *
 * Para migrar a un storage externo (S3, Cloudinary, Vercel Blob, etc.) solo hay
 * que reemplazar el cuerpo de `saveFile` y `deleteFile` — el resto de la app
 * únicamente conoce la URL pública devuelta, nunca la ruta física del archivo.
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

function getUploadsDir() {
  const dir = process.env.UPLOADS_DIR || "./storage/uploads";
  // turbopackIgnore: la ruta depende de una env var y vive fuera de /app,
  // así que no debe hacer que el tracer empaquete todo el proyecto.
  return path.isAbsolute(dir) ? dir : path.join(/* turbopackIgnore: true */ process.cwd(), dir);
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

  const uploadsDir = getUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = EXTENSION_BY_MIME[mimeType] || "bin";
  const baseName = slugify(originalName.replace(/\.[^/.]+$/, "")) || "archivo";
  const fileName = `${randomUUID()}-${baseName}.${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/api/uploads/${fileName}`,
    name: fileName,
    type: mimeType,
    size: buffer.length,
  };
}

/**
 * Elimina un archivo previamente guardado a partir de su URL pública.
 * Solo opera dentro de UPLOADS_DIR (protegido contra path traversal).
 */
export async function deleteFile(url) {
  if (!url || !url.startsWith("/api/uploads/")) return;

  const fileName = path.basename(url);
  const uploadsDir = getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);

  // Verificación de seguridad: el archivo resuelto debe seguir dentro de uploadsDir.
  if (!filePath.startsWith(uploadsDir)) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
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
