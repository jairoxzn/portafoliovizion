import { getSettings } from "@/actions/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Configuración" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">Datos de la empresa mostrados en el sitio público.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
