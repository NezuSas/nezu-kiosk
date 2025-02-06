import { defineConfig, loadEnv } from "vite";
import { imagetools } from 'vite-imagetools';
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "VITE_");
    console.log("\uD83D\uDE80 Running in ".concat(mode, " mode"));
    console.log("🔗 API URL:", env.VITE_API_URL);
    return {
        define: {
            "process.env.VITE_ENV": JSON.stringify(env.VITE_ENV),
            "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL)
        },
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
                    manualChunks: function (id) {
                        if (id.includes('development'))
                            return null;
                        if (id.includes("node_modules")) {
                            if (id.includes("react") || id.includes("react-dom"))
                                return "react-core";
                            if (id.includes("zustand") || id.includes("socket.io-client"))
                                return "state-vendor";
                            if (id.includes("lodash") || id.includes("date-fns"))
                                return "utility-libs";
                            return "vendor";
                        }
                    },
                    entryFileNames: "assets/[name]-[hash].js",
                    chunkFileNames: "assets/[name]-[hash].js",
                    assetFileNames: "assets/[ext]/[name]-[hash][extname]"
                }
            }
        },
        plugins: [
            react(),
            imagetools({
                defaultDirectives: new URLSearchParams({
                    format: "webp;avif",
                    quality: "80"
                })
            }),
            compression({
                algorithm: "gzip",
                ext: ".gz",
                deleteOriginFile: false,
                threshold: 10240,
                filter: function (file) { return /\.(js|css)$/.test(file); }
            }),
            compression({
                algorithm: "brotliCompress",
                ext: ".br",
                deleteOriginFile: false,
                threshold: 10240,
                filter: function (file) { return /\.(js|css)$/.test(file); }
            })
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        server: {
            proxy: {
                "/socket.io": {
                    target: process.env.NODE_ENV === "production" ? "http://localhost:4000" : "http://localhost:4000",
                    ws: true,
                    changeOrigin: true
                }
            },
            allowedHosts: [".ngrok-free.app"]
        }
    };
});
