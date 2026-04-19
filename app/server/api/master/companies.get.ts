export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const apiUrl = `${config.public.apiBase}/master/companies`;
  const headers: Record<string, string> = {};

  const cookie = event.node.req.headers.cookie;
  if (cookie) headers.cookie = cookie;

  const url = new URL(apiUrl, "http://localhost");
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.append(k, String(v));
    });
  }

  try {
    const response = await fetch(url.toString(), { headers });
    return await response.json();
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to fetch from upstream",
    });
  }
});
