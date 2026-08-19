import { getSettings } from "@/actions/settings";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

// Todo el sitio público lee de la base de datos (proyectos, configuración,
// tecnologías). Si se deja como estático, "next build" intenta generar estas
// páginas en build-time y falla si la base de datos (Neon) no responde en
// ese momento — algo que puede pasar por un cold-start del compute o una
// caída transitoria de red durante el deploy. Forzamos render dinámico (por
// request) para que el build nunca dependa de que la DB esté disponible.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }) {
  const settings = await getSettings();

  return (
    <>
      <Navbar companyName={settings.companyName} logo={settings.logo} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
