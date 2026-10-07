export function isPreviewHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return host === 'localhost' || host.endsWith('.pages.dev') || host.endsWith('.vercel.app');
}

export function needsTrailingSlash(pathname) {
  if (!pathname || pathname === '/' || pathname.endsWith('/')) return false;
  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || '';
  return !lastSegment.includes('.');
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const preview = isPreviewHost(url.hostname);

  if (needsTrailingSlash(url.pathname)) {
    url.pathname = `${url.pathname}/`;
    const headers = new Headers({ Location: url.toString() });
    if (preview) headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(null, { status: 308, headers });
  }

  const response = await context.next();
  if (!preview) return response;

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Cache-Control', 'no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
