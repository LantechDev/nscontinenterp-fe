export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  if (config.public.useApiProxy) {
    return;
  }

  const normalizedApiBase = String(config.public.apiBase || "/api").replace(/\/$/, "");

  const optimizedFetch = $fetch.create({
    retry: 2,
    retryDelay: 1000,
    onRequest(context) {
      const { options } = context;
      const method = String(options.method || "GET").toUpperCase();
      const headers = new Headers(options.headers as HeadersInit | undefined);
      const requestUrl =
        typeof context.request === "string" ? context.request : context.request.toString();
      const isApiRequest = requestUrl.startsWith("/api/");

      if (isApiRequest) {
        context.request = `${normalizedApiBase}${requestUrl.slice(4)}`;
        if (options.credentials == null) {
          options.credentials = "include";
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

      // GET/HEAD requests do not need a JSON content type header and removing it
      // avoids unnecessary non-simple requests when the API is called cross-origin.
      if ((method === "GET" || method === "HEAD") && options.body == null) {
        headers.delete("content-type");
      }

      options.headers = headers;
    },
  });

  globalThis.$fetch = optimizedFetch as typeof $fetch;
});
