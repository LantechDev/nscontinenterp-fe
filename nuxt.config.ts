const apiTarget = process.env.NUXT_PUBLIC_API_TARGET || "http://localhost:9999";
const useApiProxy = process.env.NUXT_PUBLIC_USE_API_PROXY !== "false";
const configuredApiBase = process.env.NUXT_PUBLIC_API_BASE;
const apiBase = useApiProxy ? configuredApiBase || "/api" : `${apiTarget.replace(/\/$/, "")}/api`;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    preset: "vercel",
  },
  routeRules: {
    "/api/**": { cors: true, isr: false },
    "/_nuxt/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/images/**": { isr: 3600 },
    "/fonts/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/dashboard": { isr: 60 },
    "/master/**": { isr: 300 },
    "/": { isr: 60 },
    "/operational/**": { isr: 30 },
  },
  vite: {
    optimizeDeps: {
      include: [
        "vue3-apexcharts",
        "@vueuse/core",
        "lucide-vue-next",
        "jspdf",
        "clsx",
        "tailwind-merge",
        "html2canvas",
        "xlsx",
      ],
    },
  },
  srcDir: "app/",
  alias: {
    "@": "~/",
  },
  modules: ["@nuxt/image"],
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
        { rel: "icon", type: "image/png", href: "/images/logo2.jpeg" },
        { rel: "apple-touch-icon", href: "/images/logo2.jpeg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase,
      apiTarget,
      useApiProxy,
    },
  },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
        },
      },
    },
    payloadExtraction: true,
  },
});
