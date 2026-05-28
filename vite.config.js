import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "icons/budgetcommand-icon.svg", "icons/budgetcommand-maskable.svg"],
            manifest: {
                name: "BudgetCommand",
                short_name: "BudgetCommand",
                description: "A personal finance command center for planning income, tracking expenses, managing subscriptions, and allocating money into financial goals.",
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "portrait-primary",
                theme_color: "#0f2f2f",
                background_color: "#f8fafc",
                icons: [
                    {
                        src: "/icons/budgetcommand-icon.svg",
                        sizes: "192x192",
                        type: "image/svg+xml",
                        purpose: "any",
                    },
                    {
                        src: "/icons/budgetcommand-icon.svg",
                        sizes: "512x512",
                        type: "image/svg+xml",
                        purpose: "any",
                    },
                    {
                        src: "/icons/budgetcommand-maskable.svg",
                        sizes: "512x512",
                        type: "image/svg+xml",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                navigateFallback: "/index.html",
                globPatterns: ["**/*.{js,css,html,svg,ico,png,woff2}"],
                runtimeCaching: [
                    {
                        urlPattern: function (_a) {
                            var url = _a.url;
                            return url.hostname.endsWith("supabase.co");
                        },
                        handler: "NetworkOnly",
                        options: {
                            cacheName: "supabase-network-only",
                        },
                    },
                    {
                        urlPattern: function (_a) {
                            var request = _a.request;
                            return request.mode === "navigate";
                        },
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "budgetcommand-pages",
                            networkTimeoutSeconds: 3,
                        },
                    },
                    {
                        urlPattern: function (_a) {
                            var request = _a.request;
                            return ["script", "style", "font", "image"].includes(request.destination);
                        },
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "budgetcommand-assets",
                        },
                    },
                ],
            },
        }),
    ],
});
