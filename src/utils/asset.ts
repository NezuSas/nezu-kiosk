/**
 * Resolves a file of `public/` against the base the app is served from, so the same build works at the site
 * root (Vercel) and under a sub-path such as /nezu-kiosk/ (the GitHub Pages demo).
 */
export const asset = (publicPath: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${publicPath.replace(/^\//, "")}`;
