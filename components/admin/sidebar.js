"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Cpu,
  Mail,
  Settings,
  User,
  Globe,
  X,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/tecnologias", label: "Tecnologías", icon: Cpu },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  { href: "/admin/perfil", label: "Perfil", icon: User },
];

export function Sidebar({ mobileOpen, onClose, unreadMessages = 0 }) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-white text-sm font-bold">
              vT
            </span>
            <span>viziontech</span>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={onClose} aria-label="Cerrar menú">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-electric/10 text-brand-electric"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {label === "Mensajes" && unreadMessages > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-electric px-1 text-[11px] font-semibold text-white">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            Ver sitio público
          </Link>
        </div>
      </aside>
    </>
  );
}
