export function isPreviewHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return host === 'localhost' || host.endsWith('.pages.dev') || host.endsWith('.vercel.app');
}

export async function onRequest(context) {
  const response = await context.next();
  const hostname = new URL(context.request.url).hostname;

  if (!isPreviewHost(hostname)) return response;

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Cache-Control', 'no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
