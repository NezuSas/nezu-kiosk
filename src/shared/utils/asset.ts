/**
 * Resuelve un archivo de `public/` contra la ruta base del despliegue, para que la misma build sirva en la raíz
 * (Vercel) y bajo una sub-ruta como /nezu-kiosk/ (la demo de GitHub Pages).
 */
export const asset = (publicPath: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${publicPath.replace(/^\//, "")}`;
