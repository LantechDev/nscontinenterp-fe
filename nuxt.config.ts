// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app/",
  alias: {
    "@": "~/",
  },
  modules: ["@nuxt/image"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "NS Continent ERP",
      meta: [
        {
          name: "description",
          content: "NS Continent ERP - Freight Forwarding & Logistics Management System",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/images/logo2.png" },
        { rel: "apple-touch-icon", href: "/images/logo2.png" },
        // Preconnect to Google Fonts for faster loading
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3010/api",
    },
  },
  // Performance optimization: Hybrid rendering with route rules
  routeRules: {
    // Static pages - disabled prerender so we can use runtime config for API
    // "/": { prerender: true },
    // "/login": { prerender: true },
    // Dashboard and data pages - SWR caching for 1 hour
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
