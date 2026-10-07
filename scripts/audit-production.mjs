const rawOrigin = process.env.PRODUCTION_URL?.trim();
const rawPreview = process.env.PREVIEW_URL?.trim();

function fail(message) {
  console.error(`PRODUCTION AUDIT FAIL: ${message}`);
  process.exitCode = 1;
}

function normalizeOrigin(value, label) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error('must use HTTPS');
    if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
      throw new Error('must be a bare origin with no path/query/hash');
    }
    return url.origin;
  } catch (error) {
    fail(`${label} is invalid: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
}

const origin = normalizeOrigin(rawOrigin, 'PRODUCTION_URL');
const previewOrigin = normalizeOrigin(rawPreview, 'PREVIEW_URL');

if (!origin) {
  fail('Set PRODUCTION_URL to the final HTTPS origin, for example https://example.cl');
  process.exit();
}

const routes = [
  '/',
  '/generador-de-notas/',
  '/escala-de-notas/',
  '/escala-de-notas/60/',
  '/promedio-de-notas/',
  '/notas-con-porcentaje/',
  '/que-nota-necesito/',
  '/guias/',
  '/guias/redondeo-de-notas/',
  '/guias/promedio-simple-vs-ponderado/',
  '/guias/concentracion-de-notas-ensenanza-media/',
  '/sobre-nosotros/',
  '/contacto/',
  '/politica-de-privacidad/',
  '/terminos/',
  '/cookies/',
];

const userAgent = 'NotaCL-Production-Audit/1.0';

function canonicalFrom(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || '';
}

async function request(url, options = {}) {
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': userAgent },
      ...options,
    });
  } catch (error) {
    fail(`request failed for ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

for (const route of routes) {
  const expected = new URL(route, origin).toString();
  const response = await request(expected);
  if (!response) continue;

  if (response.status !== 200) {
    fail(`${route} returned HTTP ${response.status}`);
    continue;
  }

  if (response.url !== expected) {
    fail(`${route} resolved to unexpected URL ${response.url}; expected ${expected}`);
  }

  const language = response.headers.get('content-language') || '';
  if (!language.toLowerCase().includes('es-cl')) {
    fail(`${route} is missing Content-Language: es-CL`);
  }

  for (const header of ['x-content-type-options', 'referrer-policy', 'x-frame-options']) {
    if (!response.headers.get(header)) fail(`${route} is missing security response header ${header}`);
  }

  const html = await response.text();
  const canonical = canonicalFrom(html);
  if (canonical !== expected) fail(`${route} canonical mismatch: expected ${expected}, got ${canonical || '(missing)'}`);

  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  if (!robots.includes('index,follow')) fail(`${route} is not indexable in production HTML`);
}

const slashProbe = new URL('/escala-de-notas', origin);
const slashResponse = await request(slashProbe, { redirect: 'manual' });
if (slashResponse) {
  const expectedLocation = new URL('/escala-de-notas/', origin).toString();
  const location = slashResponse.headers.get('location');
  if (![301, 308].includes(slashResponse.status) || location !== expectedLocation) {
    fail(`trailing-slash redirect expected 301/308 → ${expectedLocation}; got ${slashResponse.status} → ${location || '(missing)'}`);
  }
}

const missingUrl = new URL('/__notacl_release_audit_missing__/', origin);
const missingResponse = await request(missingUrl, { redirect: 'manual' });
if (missingResponse) {
  if (missingResponse.status !== 404) fail(`missing URL must return HTTP 404, got ${missingResponse.status}`);
  const robotsHeader = missingResponse.headers.get('x-robots-tag') || '';
  if (!robotsHeader.toLowerCase().includes('noindex')) fail('404 response is missing X-Robots-Tag: noindex');
}

const robotsResponse = await request(new URL('/robots.txt', origin));
if (robotsResponse) {
  if (robotsResponse.status !== 200) fail(`robots.txt returned HTTP ${robotsResponse.status}`);
  const robots = await robotsResponse.text();
  if (!robots.includes('Allow: /')) fail('robots.txt does not allow production crawling');
  if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) fail('robots.txt sitemap URL does not match production origin');
}

const sitemapResponse = await request(new URL('/sitemap.xml', origin));
if (sitemapResponse) {
  if (sitemapResponse.status !== 200) fail(`sitemap.xml returned HTTP ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  for (const route of routes) {
    const expected = new URL(route, origin).toString();
    if (!sitemap.includes(expected)) fail(`sitemap.xml is missing ${expected}`);
  }
}

if (previewOrigin) {
  const previewResponse = await request(new URL('/', previewOrigin), { redirect: 'manual' });
  if (previewResponse) {
    const robotsHeader = previewResponse.headers.get('x-robots-tag') || '';
    if (!robotsHeader.toLowerCase().includes('noindex')) {
      fail(`preview origin ${previewOrigin} is missing X-Robots-Tag: noindex`);
    }
  }
}

if (!process.exitCode) {
  console.log(`Production audit passed for ${routes.length} canonical routes on ${origin}.`);
  if (previewOrigin) console.log(`Preview noindex header verified on ${previewOrigin}.`);
}
