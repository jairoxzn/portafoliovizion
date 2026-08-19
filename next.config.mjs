/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Imágenes de ejemplo del seed (prisma/seed.js). Puedes quitarlo una vez
      // reemplaces los proyectos de prueba por imágenes reales subidas desde el panel.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
