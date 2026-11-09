import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    target: "es2022",
    minify: mode === "production" ? "terser" : "esbuild",
    sourcemap: mode !== "production",
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
          if (id.includes("socket.io") || id.includes("engine.io")) return "realtime";
          return "vendor";
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash][extname]",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    // El servidor en tiempo real (server/) escucha en 4000; así el kiosko y el teléfono hablan con el mismo origen.
    proxy: {
      "/socket.io": { target: "http://127.0.0.1:4000", ws: true, changeOrigin: true },
    },
    allowedHosts: [".nezuecuador.com", "localhost", "127.0.0.1"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: { modules: { classNameStrategy: "non-scoped" } },
    exclude: [...configDefaults.exclude, "server/**", "docs/**"],
  },
}));
