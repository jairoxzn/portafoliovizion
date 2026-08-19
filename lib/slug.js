/**
 * Convierte un texto en un slug URL-friendly.
 * "Sistema de Gestión para Barbería" -> "sistema-de-gestion-para-barberia"
 */
export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos (marcas diacríticas tras NFD)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // quita caracteres especiales
    .replace(/\s+/g, "-") // espacios -> guiones
    .replace(/-+/g, "-") // colapsa guiones repetidos
    .replace(/^-+|-+$/g, ""); // quita guiones al inicio/final
}

/**
 * Genera un slug único consultando la base de datos.
 * `checkExists(slug)` debe devolver true si el slug ya existe (opcionalmente excluyendo un id).
 */
export async function generateUniqueSlug(text, checkExists) {
  const base = slugify(text) || "item";
  let slug = base;
  let counter = 2;

  while (await checkExists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
