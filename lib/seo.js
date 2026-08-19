export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

const DEFAULT_TITLE = "viziontech | Desarrollo de software a medida";
const DEFAULT_DESCRIPTION =
  "Desarrollamos sistemas, plataformas y soluciones tecnológicas a medida para potenciar tu negocio.";

/**
 * Construye un objeto `metadata` de Next.js consistente (title, description,
 * keywords, Open Graph, Twitter Card y canonical URL).
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  path = "/",
  image,
} = {}) {
  const siteUrl = getSiteUrl();
  const fullTitle = title ? `${title} | viziontech` : DEFAULT_TITLE;
  const url = new URL(path, siteUrl).toString();
  const ogImage = image ? new URL(image, siteUrl).toString() : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "viziontech",
      locale: "es_ES",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
