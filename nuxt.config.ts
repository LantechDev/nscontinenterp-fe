// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app/",
  alias: {
    "@": "~/",
  },
  modules: ["@nuxt/image", "@vite-pwa/nuxt"],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["vue-sonner"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "NS Continent ERP",
      short_name: "NS ERP",
      description: "NS Continent ERP - Freight Forwarding & Logistics Management System",
      theme_color: "#012D5A",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "pwa/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa/maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/offline",
      navigateFallbackDenylist: [/^\/api\//],
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: "module",
    },
  },

  app: {
    head: {
      title: "NS Continent ERP",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no",
        },
        {
          name: "description",
          content: "NS Continent ERP - Freight Forwarding & Logistics Management System",
        },
        { name: "theme-color", content: "#012D5A" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/images/logo2.png" },
        { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" },
        // Preconnect to Google Fonts for faster loading
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:9999/api",
    },
  },
  // Performance optimization: Hybrid rendering with route rules
  routeRules: {
    "/dashboard": { swr: 3600 },
    "/master/**": { swr: 3600 },
    "/operational/**": { swr: 3600 },
    "/finance/**": { swr: 3600 },
    "/sales/**": { swr: 3600 },
    "/reports/**": { swr: 3600 },
    "/settings/**": { swr: 3600 },
  },
  // NuxtLink performance optimization
  experimental: {
    defaults: {
      nuxtLink: {
        // Prefetch on interaction instead of visibility for better performance
        prefetchOn: {
          interaction: true,
        },
      },
    },
  },
});
