import Link from "next/link";
import { FolderKanban, CheckCircle2, FileEdit, Tags, Cpu, Eye, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/actions/projects";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, statusLabel, statusStyle } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general de viziontech</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={FolderKanban} label="Proyectos" value={stats.total} />
        <StatCard icon={CheckCircle2} label="Publicados" value={stats.published} accent="text-emerald-500" />
        <StatCard icon={FileEdit} label="Borradores" value={stats.draft} accent="text-amber-500" />
        <StatCard icon={Tags} label="Categorías" value={stats.categories} accent="text-brand-cobalt" />
        <StatCard icon={Cpu} label="Tecnologías" value={stats.technologies} accent="text-violet-500" />
        <StatCard icon={Eye} label="Visitas totales" value={stats.totalViews} accent="text-sky-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-semibold">Últimos proyectos</h2>
            <Link href="/admin/proyectos" className="text-sm font-medium text-brand-electric hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.latestProjects.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="Aún no hay proyectos"
                description="Crea tu primer proyecto para verlo aquí."
                className="border-none"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Proyecto</th>
                      <th className="px-5 py-3 font-medium">Categoría</th>
                      <th className="px-5 py-3 font-medium">Estado</th>
                      <th className="px-5 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.latestProjects.map((project) => (
                      <tr key={project.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                        <td className="px-5 py-3">
                          <Link href={`/admin/proyectos/${project.id}/editar`} className="font-medium hover:text-brand-electric">
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{project.category?.name || "—"}</td>
                        <td className="px-5 py-3">
                          <Badge className={statusStyle(project.status)}>{statusLabel(project.status)}</Badge>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{formatDate(project.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">Proyectos más visitados</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topProjects.filter((p) => p._count.views > 0).length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no hay visitas registradas.</p>
            ) : (
              stats.topProjects
                .filter((p) => p._count.views > 0)
                .map((project) => (
                  <div key={project.id} className="flex items-center justify-between gap-3">
                    <Link href={`/admin/proyectos/${project.id}/editar`} className="truncate text-sm font-medium hover:text-brand-electric">
                      {project.name}
                    </Link>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                      {project._count.views}
                    </span>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
