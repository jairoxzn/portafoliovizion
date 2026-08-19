import { NextResponse } from "next/server";
import { readFile, extensionMimeType } from "@/lib/storage";

// Sirve los archivos guardados por el adaptador de storage local.
// GET /api/uploads/<archivo>
export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const fileName = segments?.[segments.length - 1];

  if (!fileName) {
    return NextResponse.json({ error: "Archivo no especificado" }, { status: 400 });
  }

  try {
    const buffer = await readFile(fileName);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": extensionMimeType(fileName),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 400 });
  }
}
