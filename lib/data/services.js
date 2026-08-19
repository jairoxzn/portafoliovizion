import { LayoutDashboard, ShoppingCart, Smartphone, Workflow, Brain, Server } from "lucide-react";

// Contenido institucional estático: los SERVICIOS que ofrece viziontech no son
// una entidad administrable desde el panel (a diferencia de los proyectos,
// categorías y tecnologías, que siempre vienen de PostgreSQL vía Prisma).
export const SERVICES = [
  {
    icon: LayoutDashboard,
    title: "Sistemas empresariales a medida",
    description: "ERPs, dashboards y herramientas internas adaptadas a los procesos reales de tu negocio.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce y sistemas POS",
    description: "Tiendas en línea y puntos de venta con gestión de inventario, ventas y reportes.",
  },
  {
    icon: Smartphone,
    title: "Aplicaciones web y móviles",
    description: "Plataformas y apps responsivas, rápidas y pensadas para tus usuarios finales.",
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    description: "Integraciones y flujos automatizados que eliminan tareas manuales repetitivas.",
  },
  {
    icon: Brain,
    title: "Soluciones con Inteligencia Artificial",
    description: "Funcionalidades potenciadas por IA integradas a tus sistemas existentes.",
  },
  {
    icon: Server,
    title: "Infraestructura y despliegue",
    description: "Bases de datos, hosting y arquitectura lista para producción y escalamiento.",
  },
];
