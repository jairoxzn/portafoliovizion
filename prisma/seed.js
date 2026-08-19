import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/slug.js";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Sistemas empresariales", description: "ERPs y sistemas de gestión a medida." },
  { name: "Sistemas POS", description: "Punto de venta para comercios." },
  { name: "E-commerce", description: "Tiendas en línea." },
  { name: "Plataformas web", description: "Plataformas y portales web." },
  { name: "Sistemas educativos", description: "Gestión académica y aprendizaje." },
  { name: "Sistemas para restaurantes", description: "Gestión de pedidos y mesas." },
  { name: "Sistemas para barberías", description: "Reservas y gestión de citas." },
  { name: "Aplicaciones móviles", description: "Apps para iOS y Android." },
  { name: "Automatización", description: "Automatización de procesos de negocio." },
  { name: "Inteligencia Artificial", description: "Soluciones potenciadas por IA." },
];

const TECHNOLOGIES = [
  { name: "Next.js", color: "#000000" },
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#3C873A" },
  { name: "Laravel", color: "#FF2D20" },
  { name: "PHP", color: "#777BB4" },
  { name: "Python", color: "#3776AB" },
  { name: "Prisma", color: "#0C344B" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MySQL", color: "#4479A1" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Tailwind CSS", color: "#00AEEF" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Docker", color: "#2496ED" },
];

const PROJECTS = [
  {
    name: "Sistema POS para Tienda de Ropa",
    category: "Sistemas POS",
    shortDescription:
      "Plataforma diseñada para administrar ventas, productos, inventario, clientes y reportes.",
    description:
      "Sistema de punto de venta desarrollado a medida para una cadena de tiendas de ropa. Permite registrar ventas en mostrador, controlar el inventario en tiempo real por talla y color, gestionar clientes frecuentes y generar reportes de caja y ventas por sucursal.",
    problem:
      "La tienda llevaba el control de ventas e inventario en hojas de cálculo, lo que generaba descuadres de caja y falta de visibilidad del stock real.",
    features: [
      "Gestión de productos",
      "Gestión de inventario",
      "Registro de ventas",
      "Reportes",
      "Usuarios y roles",
      "Dashboard",
      "Control de caja",
    ],
    client: "Boutique Elegance",
    status: "COMPLETADO",
    published: true,
    featured: true,
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    links: [
      { name: "Demo", url: "https://demo.viziontech.dev/pos-ropa", type: "DEMO" },
      { name: "Repositorio", url: "https://github.com/viziontech/pos-tienda-ropa", type: "REPOSITORIO" },
    ],
  },
  {
    name: "Sistema de Gestión para Barbería",
    category: "Sistemas para barberías",
    shortDescription:
      "Plataforma web para gestionar clientes, reservas, servicios y horarios.",
    description:
      "Aplicación para barberías que permite a los clientes reservar citas en línea, elegir barbero y servicio, y al administrador gestionar la agenda, los servicios ofrecidos y el historial de cada cliente.",
    problem:
      "Las reservas se coordinaban por WhatsApp, generando choques de horario y pérdida de clientes por falta de disponibilidad visible.",
    features: [
      "Reservas en línea",
      "Agenda por barbero",
      "Gestión de servicios",
      "Historial de clientes",
      "Recordatorios",
      "Dashboard",
    ],
    client: "Barbería Central",
    status: "COMPLETADO",
    published: true,
    featured: true,
    technologies: ["Next.js", "React", "PostgreSQL", "Prisma", "Tailwind CSS"],
    links: [
      { name: "Sistema", url: "https://barberiacentral.viziontech.dev", type: "SISTEMA" },
    ],
  },
  {
    name: "Sistema de Pedidos para Restaurante",
    category: "Sistemas para restaurantes",
    shortDescription:
      "Gestión de mesas, pedidos, cocina y facturación para restaurantes.",
    description:
      "Plataforma que digitaliza la toma de pedidos en mesa, la comunicación con cocina en tiempo real y la facturación, reduciendo errores y tiempos de espera.",
    problem:
      "Los pedidos se tomaban en papel y se traspapelaban entre mesero y cocina, generando errores y demoras.",
    features: [
      "Gestión de mesas",
      "Toma de pedidos",
      "Pantalla de cocina en tiempo real",
      "Facturación",
      "Reportes de ventas",
    ],
    client: "Restaurante Sabor Andino",
    status: "EN_DESARROLLO",
    published: true,
    featured: false,
    technologies: ["Node.js", "React", "MongoDB", "Tailwind CSS"],
    links: [{ name: "Demo", url: "https://demo.viziontech.dev/restaurante", type: "DEMO" }],
  },
  {
    name: "E-commerce Multi-tienda",
    category: "E-commerce",
    shortDescription:
      "Tienda en línea con catálogo, carrito, pagos y panel de vendedores.",
    description:
      "Plataforma de comercio electrónico que permite a múltiples vendedores publicar productos bajo un mismo marketplace, con carrito de compras, pasarela de pagos y panel independiente por vendedor.",
    problem:
      "Varios pequeños comercios no contaban con presencia en línea ni una forma económica de vender fuera de redes sociales.",
    features: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pagos",
      "Panel por vendedor",
      "Gestión de pedidos",
      "Cupones de descuento",
    ],
    client: "Marketplace Regional",
    status: "MANTENIMIENTO",
    published: true,
    featured: true,
    technologies: ["Next.js", "React", "PostgreSQL", "Prisma", "Tailwind CSS", "TypeScript"],
    links: [
      { name: "Sistema", url: "https://marketplace.viziontech.dev", type: "SISTEMA" },
      { name: "Documentación", url: "https://docs.viziontech.dev/marketplace", type: "DOCUMENTACION" },
    ],
  },
  {
    name: "Plataforma de Gestión Educativa",
    category: "Sistemas educativos",
    shortDescription:
      "Gestión de estudiantes, calificaciones, asistencia y comunicación con padres.",
    description:
      "Sistema para instituciones educativas que centraliza matrícula, calificaciones, asistencia y comunicación entre docentes, estudiantes y representantes.",
    problem:
      "La institución manejaba calificaciones y asistencia en registros físicos y hojas de cálculo dispersas entre docentes.",
    features: [
      "Matrícula de estudiantes",
      "Registro de calificaciones",
      "Control de asistencia",
      "Comunicados a representantes",
      "Reportes académicos",
    ],
    client: "Instituto Nueva Generación",
    status: "DEMO",
    published: false,
    featured: false,
    technologies: ["Laravel", "PHP", "MySQL", "Tailwind CSS"],
    links: [{ name: "Demo", url: "https://demo.viziontech.dev/educativo", type: "DEMO" }],
  },
];

async function main() {
  console.log("Sembrando datos de viziontech…");

  // --- Admin ---
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@viziontech.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || "Administrador",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ Usuario admin listo: ${adminEmail}`);

  // --- Categorías ---
  const categoryBySlug = {};
  for (const [index, cat] of CATEGORIES.entries()) {
    const slug = slugify(cat.name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: cat.name, slug, description: cat.description, order: index },
    });
    categoryBySlug[cat.name] = category;
  }
  console.log(`✔ ${CATEGORIES.length} categorías listas`);

  // --- Tecnologías ---
  const techBySlug = {};
  for (const tech of TECHNOLOGIES) {
    const slug = slugify(tech.name);
    const technology = await prisma.technology.upsert({
      where: { slug },
      update: {},
      create: { name: tech.name, slug, color: tech.color, icon: "Code2", active: true },
    });
    techBySlug[tech.name] = technology;
  }
  console.log(`✔ ${TECHNOLOGIES.length} tecnologías listas`);

  // --- Proyectos ---
  for (const [index, p] of PROJECTS.entries()) {
    const slug = slugify(p.name);
    const seedImg = `https://picsum.photos/seed/${slug}/1200/800`;

    const project = await prisma.project.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        shortDescription: p.shortDescription,
        description: p.description,
        problem: p.problem,
        features: p.features,
        client: p.client,
        categoryId: categoryBySlug[p.category].id,
        mainImage: seedImg,
        status: p.status,
        published: p.published,
        featured: p.featured,
        order: index,
        developmentDate: new Date(2024, index, 15),
        metaTitle: `${p.name} | viziontech`,
        metaDescription: p.shortDescription,
        metaKeywords: p.technologies.join(", "),
        images: {
          create: [0, 1, 2].map((i) => ({
            url: `https://picsum.photos/seed/${slug}-${i}/1200/800`,
            alt: `${p.name} — captura ${i + 1}`,
            order: i,
          })),
        },
        links: {
          create: p.links,
        },
        technologies: {
          create: p.technologies.map((techName) => ({
            technologyId: techBySlug[techName].id,
          })),
        },
      },
    });
    console.log(`✔ Proyecto creado: ${project.name}`);
  }

  // --- Settings ---
  await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      companyName: "viziontech",
      description:
        "Desarrollamos sistemas, plataformas y soluciones tecnológicas a medida para potenciar tu negocio.",
      email: "contacto@viziontech.com",
      phone: "+58 000-0000000",
      whatsapp: "+58 000-0000000",
      address: "",
      schedule: "Lunes a viernes, 9:00 - 18:00",
      facebook: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
      github: "https://github.com/viziontech",
    },
  });
  console.log("✔ Configuración de empresa lista");

  // --- Mensaje de ejemplo ---
  await prisma.message.upsert({
    where: { id: "seed-message-1" },
    update: {},
    create: {
      id: "seed-message-1",
      name: "Cliente de ejemplo",
      email: "cliente@ejemplo.com",
      phone: "+58 000-0000000",
      company: "Empresa Ejemplo",
      subject: "Cotización de sistema",
      message: "Hola, me gustaría cotizar un sistema similar al de gestión de barbería. ¿Podrían contactarme?",
      read: false,
    },
  });
  console.log("✔ Mensaje de contacto de ejemplo listo");

  console.log("\nListo. Datos de prueba fácilmente eliminables desde /admin.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
