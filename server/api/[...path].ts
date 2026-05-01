const HOP_BY_HOP_HEADERS = new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "origin",
  "proxy-authenticate",
  "proxy-authorization",
  "referer",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-user",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "user-agent",
]);

export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig();
  const method = String(event.method || "GET").toUpperCase();
  const target = String(config.public.apiTarget || "http://localhost:9999").replace(/\/$/, "");
  const requestUrl = getRequestURL(event);
  const path = requestUrl.pathname.replace(/^\/api\//, "");
  const url = new URL(`${target}/api/${path}`);

  requestUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(event.node.req.headers)) {
      if (!value) continue;

      const normalizedKey = key.toLowerCase();
      if (HOP_BY_HOP_HEADERS.has(normalizedKey)) continue;

      if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      } else {
        headers.set(key, value);
      }
    }

    const rawBody =
      method === "GET" || method === "HEAD" ? undefined : await readRawBody(event, false);
    const body =
      rawBody == null ? undefined : typeof rawBody === "string" ? rawBody : new Uint8Array(rawBody);

    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
      redirect: "manual",
    });

    event.node.res.statusCode = response.status;
    event.node.res.statusMessage = response.statusText;

    for (const [key, value] of response.headers.entries()) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey === "set-cookie" || HOP_BY_HOP_HEADERS.has(normalizedKey)) {
        continue;
      }

      event.node.res.setHeader(key, value);
    }

    const setCookieHeaders =
      "getSetCookie" in response.headers ? response.headers.getSetCookie() : [];

    if (setCookieHeaders.length > 0) {
      event.node.res.setHeader("set-cookie", setCookieHeaders);
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    return new Uint8Array(await response.arrayBuffer());
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to connect to upstream API",
    });
  }
});
