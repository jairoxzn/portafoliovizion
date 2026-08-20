"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { quoteSchema } from "@/schemas/quote";
import { calculateQuoteTotals } from "@/lib/quotes";
import { saveFile, deleteFile, ALLOWED_DOCUMENT_TYPES } from "@/lib/storage";
import { getSettings } from "@/actions/settings";
import { getSiteUrl } from "@/lib/seo";

const QUOTE_INCLUDE = { client: true, items: { orderBy: { order: "asc" } } };

export async function listQuotes({ q = "", status = "", clientId = "" } = {}) {
  await requireAdmin();

  return prisma.quote.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(clientId ? { clientId } : {}),
      ...(q
        ? {
            OR: [
              { number: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
              { client: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuoteById(id) {
  await requireAdmin();
  return prisma.quote.findUnique({ where: { id }, include: QUOTE_INCLUDE });
}

async function generateQuoteNumber(tx) {
  const year = new Date().getFullYear();
  const prefix = `COT-${year}-`;
  const count = await tx.quote.count({ where: { number: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

function toQuoteData(parsed) {
  const { items, validUntil, ...rest } = parsed;
  return {
    scalars: { ...rest, validUntil: validUntil ? new Date(validUntil) : null },
    items,
  };
}

export async function createQuote(input) {
  await requireAdmin();

  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const { scalars, items } = toQuoteData(parsed.data);

  const quote = await prisma.$transaction(async (tx) => {
    const number = await generateQuoteNumber(tx);
    return tx.quote.create({
      data: {
        ...scalars,
        number,
        items: { create: items.map((item, i) => ({ ...item, order: i })) },
      },
      include: QUOTE_INCLUDE,
    });
  });

  revalidateQuotes();
  return { success: true, data: quote };
}

export async function updateQuote(id, input) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const { scalars, items } = toQuoteData(parsed.data);

  const quote = await prisma.$transaction(async (tx) => {
    await tx.quoteItem.deleteMany({ where: { quoteId: id } });
    return tx.quote.update({
      where: { id },
      data: {
        ...scalars,
        // El PDF queda desactualizado tras editar — se regenera al pedirlo de nuevo.
        pdfUrl: null,
        items: { create: items.map((item, i) => ({ ...item, order: i })) },
      },
      include: QUOTE_INCLUDE,
    });
  });

  revalidateQuotes(id);
  return { success: true, data: quote };
}

export async function deleteQuote(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) return { success: false, error: "Cotización no encontrada" };

  if (quote.pdfUrl) await deleteFile(quote.pdfUrl);

  await prisma.quote.delete({ where: { id } });
  revalidateQuotes(id);
  return { success: true };
}

export async function setQuoteStatus(id, status) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const data = { status };
  if (status === "ENVIADA") data.sentAt = new Date();
  if (status === "ACEPTADA" || status === "RECHAZADA") data.respondedAt = new Date();

  const quote = await prisma.quote.update({ where: { id }, data });
  revalidateQuotes(id);
  return { success: true, data: quote };
}

/** Genera (o regenera) el PDF de la cotización y devuelve su URL pública. */
export async function generateQuotePdf(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const quote = await prisma.quote.findUnique({ where: { id }, include: QUOTE_INCLUDE });
  if (!quote) return { success: false, error: "Cotización no encontrada" };

  try {
    const [{ renderToBuffer }, { QuotePdfDocument }, settings] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/lib/pdf/quote-pdf"),
      getSettings(),
    ]);

    const logo = await fetchLogoForPdf(settings.logo);

    const buffer = await renderToBuffer(QuotePdfDocument({ quote, settings, logo }));

    if (quote.pdfUrl) await deleteFile(quote.pdfUrl);

    const saved = await saveFile(buffer, `${quote.number}.pdf`, "application/pdf", {
      allowedTypes: ALLOWED_DOCUMENT_TYPES,
    });

    await prisma.quote.update({ where: { id }, data: { pdfUrl: saved.url } });
    revalidateQuotes(id);

    return { success: true, data: { url: saved.url } };
  } catch (error) {
    console.error("Error generando PDF de cotización:", error);
    return { success: false, error: error.message || "No se pudo generar el PDF." };
  }
}

export async function getQuoteStats() {
  await requireAdmin();

  const [total, accepted, sent, draft, quotes] = await Promise.all([
    prisma.quote.count(),
    prisma.quote.count({ where: { status: "ACEPTADA" } }),
    prisma.quote.count({ where: { status: "ENVIADA" } }),
    prisma.quote.count({ where: { status: "BORRADOR" } }),
    prisma.quote.findMany({ select: { discount: true, taxRate: true, status: true, currency: true, items: true } }),
  ]);

  // Cada cotización puede estar en una moneda distinta — sumar montos crudos
  // entre monedas distintas no tiene sentido, así que se agrupan por moneda.
  const quotedByCurrency = {};
  const acceptedByCurrency = {};
  for (const quote of quotes) {
    const { total: quoteTotal } = calculateQuoteTotals(quote.items, quote.discount, quote.taxRate);
    quotedByCurrency[quote.currency] = (quotedByCurrency[quote.currency] || 0) + quoteTotal;
    if (quote.status === "ACEPTADA") {
      acceptedByCurrency[quote.currency] = (acceptedByCurrency[quote.currency] || 0) + quoteTotal;
    }
  }

  const responded = quotes.filter((q) => q.status === "ACEPTADA" || q.status === "RECHAZADA").length;
  const conversionRate = responded > 0 ? Math.round((accepted / responded) * 100) : 0;

  return {
    total,
    accepted,
    sent,
    draft,
    quotedByCurrency,
    acceptedByCurrency,
    conversionRate,
  };
}

const LOGO_FORMAT_BY_EXT = { jpg: "jpg", jpeg: "jpg", png: "png" };

/**
 * Descarga el logo configurado en Settings para incrustarlo en el PDF.
 * @react-pdf/renderer solo embebe JPG/PNG de forma confiable, y necesita los
 * bytes ya resueltos (una URL relativa no sirve del lado del servidor). Si
 * algo falla, simplemente no se muestra el logo — nunca rompe el PDF entero.
 */
async function fetchLogoForPdf(logoUrl) {
  if (!logoUrl) return null;

  const ext = logoUrl.split(".").pop()?.toLowerCase().split("?")[0];
  const format = LOGO_FORMAT_BY_EXT[ext];
  if (!format) return null; // webp/gif: no soportado de forma confiable por el motor de PDF

  try {
    const absoluteUrl = logoUrl.startsWith("http") ? logoUrl : `${getSiteUrl()}${logoUrl}`;
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return { data: Buffer.from(arrayBuffer), format };
  } catch (error) {
    console.error("No se pudo descargar el logo para el PDF:", error);
    return null;
  }
}

function revalidateQuotes(id) {
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin/dashboard");
  if (id) revalidatePath(`/admin/cotizaciones/${id}`);
}
