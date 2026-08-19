import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSettings } from "@/actions/settings";
import { ContactForm } from "@/components/public/contact-form";
import { SectionHeading } from "@/components/public/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contacto",
  description: "Cuéntanos sobre tu proyecto y te ayudamos a convertirlo en un sistema real.",
  path: "/contacto",
});

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
      <SectionHeading
        eyebrow="Contacto"
        title="Hablemos de tu proyecto"
        description="Completa el formulario y nuestro equipo te contactará a la brevedad."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {settings.email && <InfoRow icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />}
          {settings.phone && <InfoRow icon={Phone} label="Teléfono" value={settings.phone} href={`tel:${settings.phone}`} />}
          {settings.whatsapp && (
            <InfoRow
              icon={MessageCircle}
              label="WhatsApp"
              value={settings.whatsapp}
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
            />
          )}
          {settings.address && <InfoRow icon={MapPin} label="Dirección" value={settings.address} />}
          {settings.schedule && <InfoRow icon={Clock} label="Horario" value={settings.schedule} />}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-electric/10 text-brand-electric">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block hover:opacity-80">
        {content}
      </a>
    );
  }

  return content;
}
