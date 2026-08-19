import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPanelLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const unreadMessages = await prisma.message.count({ where: { read: false } });

  return (
    <AdminShell user={session.user} unreadMessages={unreadMessages}>
      {children}
    </AdminShell>
  );
}
