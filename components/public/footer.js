import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, GithubIcon, TiktokIcon } from "@/components/icons/social";

const SOCIAL_LINKS = [
  { key: "facebook", icon: FacebookIcon, label: "Facebook" },
  { key: "instagram", icon: InstagramIcon, label: "Instagram" },
  { key: "tiktok", icon: TiktokIcon, label: "TikTok" },
  { key: "linkedin", icon: LinkedinIcon, label: "LinkedIn" },
  { key: "github", icon: GithubIcon, label: "GitHub" },
];

export function Footer({ settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-white text-sm font-bold">
                vT
              </span>
              <span className="text-lg">{settings.companyName}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">{settings.description}</p>
            {(settings.facebook || settings.instagram || settings.tiktok || settings.linkedin || settings.github) && (
              <div className="mt-4 flex gap-3">
                {SOCIAL_LINKS.filter((s) => settings[s.key]).map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-brand-electric hover:text-brand-electric"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold">Navegación</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sobre-nosotros" className="hover:text-foreground">Sobre nosotros</Link></li>
              <li><Link href="/servicios" className="hover:text-foreground">Servicios</Link></li>
              <li><Link href="/proyectos" className="hover:text-foreground">Proyectos</Link></li>
              <li><Link href="/tecnologias" className="hover:text-foreground">Tecnologías</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {settings.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-foreground">{settings.email}</a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-foreground">{settings.phone}</a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {settings.address}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Horario</h3>
            <p className="mt-3 text-sm text-muted-foreground">{settings.schedule || "Contáctanos para más información"}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year} {settings.companyName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
