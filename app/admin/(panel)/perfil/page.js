import { getSession } from "@/lib/session";
import { ProfileForms } from "@/components/admin/profile-forms";

export const metadata = { title: "Perfil" };

export default async function AdminProfilePage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu cuenta de administrador.</p>
      </div>
      <ProfileForms user={session.user} />
    </div>
  );
}
