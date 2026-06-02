import { clearNuxtData, refreshNuxtData } from "#app";

async function handleUnauthorized() {
  if (import.meta.client) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_expiry");
    localStorage.removeItem("active_organization_id");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}

function getClientToken(): string | null {
  if (import.meta.client) {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const normalizedApiBase = String(config.public.apiBase || "/api").replace(/\/$/, "");
  let redirectInProgress = false;
  let refreshQueued = false;

  const queueApiDataRefresh = () => {
    if (!import.meta.client || refreshQueued) return;
    refreshQueued = true;

    queueMicrotask(() => {
      clearNuxtData();
      refreshNuxtData()
        .catch((error) => {
          console.warn("[API] Failed to refresh Nuxt data after mutation:", error);
        })
        .finally(() => {
          refreshQueued = false;
        });
    });
  };

  const optimizedFetch = $fetch.create({
    retry: 2,
    retryDelay: 1000,
    onRequest(context) {
      const { options } = context;
      const method = String(options.method || "GET").toUpperCase();
      const headers = new Headers(options.headers as HeadersInit | undefined);
      const requestUrl =
        typeof context.request === "string" ? context.request : context.request.toString();
      const isApiPath = requestUrl.startsWith("/api/");
      const isAbsoluteApiRequest =
        normalizedApiBase.startsWith("http") &&
        (requestUrl === normalizedApiBase || requestUrl.startsWith(`${normalizedApiBase}/`));
      const isApiRequest = isApiPath || isAbsoluteApiRequest;

      if (isApiRequest) {
        if (!config.public.useApiProxy && isApiPath) {
          context.request = `${normalizedApiBase}${requestUrl.slice(4)}`;
        }

        if (method === "GET" || method === "HEAD") {
          const currentRequest =
            typeof context.request === "string" ? context.request : context.request.toString();
          const isAbsoluteRequest = currentRequest.startsWith("http");
          const url = new URL(
            currentRequest,
            import.meta.client ? window.location.origin : "http://localhost",
          );
          url.searchParams.set("_", Date.now().toString());
          context.request = isAbsoluteRequest
            ? url.toString()
            : `${url.pathname}${url.search}${url.hash}`;
        }

        if (options.credentials == null) {
          options.credentials = "include";
        }

        // Add Bearer token for client-side requests
        if (import.meta.client) {
          const token = getClientToken();
          if (token && !headers.has("authorization") && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
        }

        if ((method === "GET" || method === "HEAD") && options.cache == null) {
          options.cache = "no-store";
        }
      }

      if (import.meta.server && isApiRequest) {
        const forwardedHeaders = useRequestHeaders([
          "cookie",
          "authorization",
          "origin",
          "x-forwarded-for",
          "user-agent",
        ]);

        for (const [key, value] of Object.entries(forwardedHeaders)) {
          if (value && !headers.has(key)) {
            headers.set(key, value);
          }
        }
      }

      if ((method === "GET" || method === "HEAD") && options.body == null) {
        headers.delete("content-type");
      }

      options.headers = headers;
    },
    onResponse(context) {
      const method = String(context.options.method || "GET").toUpperCase();
      if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return;

      const requestUrl =
        typeof context.request === "string" ? context.request : context.request.toString();
      const isApiPath = requestUrl.startsWith("/api/");
      const isAbsoluteApiRequest =
        normalizedApiBase.startsWith("http") &&
        (requestUrl === normalizedApiBase || requestUrl.startsWith(`${normalizedApiBase}/`));
      const isAuthRequest =
        requestUrl.includes("/api/auth/login") ||
        requestUrl.includes("/api/auth/logout") ||
        requestUrl.includes("/api/auth/get-session");

      if ((isApiPath || isAbsoluteApiRequest) && !isAuthRequest && context.response.ok) {
        queueApiDataRefresh();
      }
    },
    async onResponseError(context) {
      if (import.meta.client && context.response.status === 401 && !redirectInProgress) {
        const requestUrl =
          typeof context.request === "string" ? context.request : context.request.toString();
        if (
          requestUrl.includes("/api/auth/login") ||
          requestUrl.includes("/api/auth/get-session") ||
          requestUrl.includes("/api/auth/logout")
        ) {
          return;
        }
        redirectInProgress = true;
        await handleUnauthorized();
      }
    },
  });

  globalThis.$fetch = optimizedFetch as typeof $fetch;
});
