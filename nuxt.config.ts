const rawApiTarget = process.env.NUXT_PUBLIC_API_TARGET || "http://localhost:9999";
const normalizedApiTarget = rawApiTarget.replace(/\/$/, "").replace(/\/api$/, "");
const rawUseApiProxy = process.env.NUXT_PUBLIC_USE_API_PROXY;
const useApiProxy = rawUseApiProxy ? rawUseApiProxy !== "false" : true;
const configuredApiBase = process.env.NUXT_PUBLIC_API_BASE;

// If explicitly configured, prefer it as-is (supports "/api" or "https://host/api")
const apiBase = (
  configuredApiBase || (useApiProxy ? "/api" : `${normalizedApiTarget}/api`)
).replace(/\/$/, "");

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
    // Disable SSR for all app routes — this app requires authentication and makes
    // cross-origin API calls to Cloudflare Workers. SSR + cookie forwarding across
    // domains (Vercel → Cloudflare) is unreliable, so we render client-side only.
    "/**": { ssr: false, isr: false },
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
        "jszip",
      ],
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8787",
          changeOrigin: true,
          secure: false,
        },
      },
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
      apiTarget: normalizedApiTarget,
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
    payloadExtraction: false,
  },
});
