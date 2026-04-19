export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const method = event.method;

  const path = event.path.replace(/^\/api\//, "");
  const target = config.public.apiTarget || "http://localhost:9999";
  const apiUrl = `${target}/api/${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const cookie = event.node.req.headers.cookie;
  if (cookie) {
    headers.cookie = cookie;
  }

  const authHeader = event.node.req.headers.authorization;
  if (authHeader) {
    headers.authorization = authHeader;
  }

  let body: unknown | undefined;

  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      body = await readBody(event);
    } catch {
      body = undefined;
    }
  }

  const url = new URL(apiUrl);
  const query = getQuery(event);
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.append(k, String(v));
  });

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data?.message || data?.error || "API Error",
        data,
      });
    }

    setHeader(event, "Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return data;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to connect to upstream API",
    });
  }
});
