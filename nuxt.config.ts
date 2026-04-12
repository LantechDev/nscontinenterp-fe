// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: [
        "vue3-apexcharts",
        "@vueuse/core",
        "lucide-vue-next",
        "jspdf",
        "clsx",
        "tailwind-merge",
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:9999/api",
    },
  },
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
