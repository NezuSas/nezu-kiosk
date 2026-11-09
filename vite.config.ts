import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";
import dns from "node:dns";

dns.setDefaultResultOrder('ipv4first');

export default defineConfig(({ mode }) => {
  return {
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "zustand",
        "socket.io-client"
      ],
      exclude: ["@vite/client", "@vite/env"],
      esbuildOptions: {
        target: 'esnext',
        treeShaking: true,
        minify: true,
        keepNames: false
      }
    },
    build: {
      minify: mode === "production" ? "terser" : "esbuild",
      target: "esnext",
      sourcemap: mode !== "production",
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      modulePreload: {
        polyfill: false
      },
      reportCompressedSize: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.warn"],
          passes: 3,
          unsafe: true,
          pure_getters: true,
          reduce_vars: true,
          keep_fargs: false,
        },
        format: {
          comments: false,
        },
        mangle: {
          toplevel: true,
        },
        module: true,
      },
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          correctVarValueBeforeDeclaration: true,
          preset: 'recommended',
          annotations: true,
          propertyReadSideEffects: false,
        },
        output: {
          manualChunks(id) {
            if (id.includes('development')) return null;
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) return "react-core";
              if (id.includes("zustand") || id.includes("socket.io-client")) return "state-vendor";
              if (id.includes("lodash") || id.includes("date-fns")) return "utility-libs";
              return "vendor";
            }
          },
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash][extname]"
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts', css: { modules: { classNameStrategy: 'non-scoped' } },
    },
    plugins: [
      react(),
      compression({
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false,
        threshold: 10240,
        filter: (file) => /\.(js|css)$/.test(file)
      }),
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
        deleteOriginFile: false,
        threshold: 10240,
        filter: (file) => /\.(js|css)$/.test(file)
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      host: '127.0.0.1', // Forzar explícitamente IPv4 localhost
      port: 5173,
      proxy: {
        "/socket.io": {
          target: "http://127.0.0.1:4000",
          ws: true,
          changeOrigin: true
        }
      },
      allowedHosts: [
        "kiosk-pago.nezuecuador.com",
        ".nezuecuador.com",
        "localhost",
        "127.0.0.1"
      ]
    }
  };
});