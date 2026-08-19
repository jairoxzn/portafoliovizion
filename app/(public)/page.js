import { Hero } from "@/components/public/hero";
import { ServicesSection } from "@/components/public/services-section";
import { FeaturedProjectsSection } from "@/components/public/featured-projects-section";
import { TechnologiesSection } from "@/components/public/technologies-section";
import { CtaSection } from "@/components/public/cta-section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Inicio",
  description:
    "viziontech desarrolla sistemas, plataformas y soluciones tecnológicas a medida para potenciar tu negocio.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FeaturedProjectsSection />
      <TechnologiesSection />
      <CtaSection />
    </>
  );
}
