# viziontech — Portafolio

Portafolio web profesional de **viziontech**: sitio público para mostrar los sistemas
desarrollados por la empresa + panel administrativo privado para gestionarlos.

## Stack

Next.js (App Router, JavaScript) · React 19 · Tailwind CSS v4 · Prisma ORM · PostgreSQL (Neon) ·
Auth.js v5 (Credentials + JWT) · React Hook Form + Zod · Lucide React.

## Primeros pasos

```bash
npm install
cp .env.example .env   # completa DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD…
npx prisma migrate dev # crea las tablas en tu base PostgreSQL
npm run db:seed        # datos de prueba: admin, categorías, tecnologías y 5 proyectos
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para el sitio público y
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel
(usa el `ADMIN_EMAIL`/`ADMIN_PASSWORD` definidos en `.env`).

## Scripts

| Script            | Descripción                                      |
| ------------------ | ------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                            |
| `npm run build`     | Build de producción                               |
| `npm start`         | Sirve el build de producción                      |
| `npm run lint`      | ESLint                                             |
| `npm run db:migrate`| `prisma migrate dev`                              |
| `npm run db:seed`   | Ejecuta `prisma/seed.js`                          |
| `npm run db:studio` | Abre Prisma Studio                                |

## Estructura

```
app/
├── (public)/        # sitio público: inicio, sobre-nosotros, servicios, proyectos, tecnologías, contacto
├── admin/            # panel administrativo (protegido)
├── api/               # route handlers REST (proyectos, categorías, tecnologías, configuración, uploads, auth)
├── sitemap.js, robots.js
actions/               # Server Actions (CRUD de cada dominio)
schemas/               # validación Zod
components/
├── public/ admin/ ui/ # componentes por área
lib/                    # prisma, auth, storage, slug, seo, utils…
prisma/                 # schema.prisma + seed.js
storage/uploads/        # archivos subidos (fuera del árbol de código, gitignored)
```

## Almacenamiento de imágenes

Las imágenes subidas desde el panel se guardan en `storage/uploads/` (fuera de `public/`,
excluido de git) y se sirven vía `app/api/uploads/[...path]`. La lógica vive detrás de una
interfaz (`lib/storage.js`) pensada para poder migrar a S3/Cloudinary/Vercel Blob más adelante
sin tocar el resto de la app.

## Seguridad

- `/admin/**` está protegido por `proxy.js` (Auth.js) y además cada Server Action/route handler
  de escritura vuelve a exigir sesión con `requireAdmin()` — nunca confía solo en la protección
  de rutas.
- Contraseñas hasheadas con bcrypt. Validación de entrada con Zod en cada mutación.
- Nunca coloques secretos en el código: usa `.env` (no versionado). `.env.example` documenta las
  variables requeridas sin valores reales.
