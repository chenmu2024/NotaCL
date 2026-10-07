import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const siteUrl = process.env.PUBLIC_SITE_URL || '';

const canonicalRoutes = [
  '/',
  '/generador-de-notas/',
  '/escala-de-notas/',
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

const forbiddenRoutes = [
  '/tabla-de-notas/',
  '/puntaje-a-nota/',
  '/escala-de-notas/60/',
  '/escala-de-notas/50/',
  '/mi-promedio/',
  '/sacar-promedio/',
  '/calcular-promedio/',
];

function fail(message) {
  console.error(`AUDIT FAIL: ${message}`);
  process.exitCode = 1;
}

function routeFile(route) {
  return route === '/' ? join(dist, 'index.html') : join(dist, route.slice(1), 'index.html');
}

function routeExists(route) {
  return existsSync(routeFile(route));
}

function readRoute(route) {
  const file = routeFile(route);
  if (!existsSync(file)) {
    fail(`${route} is missing from dist`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

function countMatches(text, regex) {
  return [...text.matchAll(regex)].length;
}

function extract(text, regex) {
  return text.match(regex)?.[1]?.trim() || '';
}

function normalizeInternalPath(href, currentRoute) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  if (/^[a-z]+:\/\//i.test(href)) return null;
  const pathOnly = href.split('#')[0].split('?')[0];
  if (!pathOnly) return null;
  if (pathOnly.startsWith('/')) return pathOnly;
  return new URL(pathOnly, `https://audit.local${currentRoute}`).pathname;
}

if (!existsSync(dist)) {
  fail('dist/ does not exist. Run npm run build before npm run audit.');
}

const titles = new Map();

for (const route of canonicalRoutes) {
  const html = readRoute(route);
  if (!html) continue;

  if (!/<html[^>]+lang="es-CL"/i.test(html)) fail(`${route} is missing lang="es-CL"`);

  const h1Count = countMatches(html, /<h1\b/gi);
  if (h1Count !== 1) fail(`${route} must contain exactly one H1, found ${h1Count}`);

  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) fail(`${route} is missing a title`);
  if (titles.has(title)) fail(`${route} duplicates title used by ${titles.get(title)}: ${title}`);
  else titles.set(title, route);

  const description = extract(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/i)
    || extract(html, /<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
  if (description.length < 70 || description.length > 180) {
    fail(`${route} meta description length is ${description.length}; expected 70–180 characters`);
  }

  const robots = extract(html, /<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)
    || extract(html, /<meta[^>]+content="([^"]+)"[^>]+name="robots"/i);

  const canonical = extract(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)
    || extract(html, /<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);

  if (siteUrl) {
    if (!robots.includes('index,follow')) fail(`${route} should be indexable when PUBLIC_SITE_URL is set`);
    const expected = new URL(route, siteUrl).toString();
    if (canonical !== expected) fail(`${route} canonical mismatch: expected ${expected}, got ${canonical || '(missing)'}`);
  } else {
    if (!robots.includes('noindex,nofollow')) fail(`${route} must fail closed with noindex,nofollow without PUBLIC_SITE_URL`);
    if (canonical) fail(`${route} should not emit a canonical before PUBLIC_SITE_URL is configured`);
  }

  if (/pages\.dev|localhost|vercel\.app|粘贴的文本/i.test(html)) {
    fail(`${route} contains a forbidden temporary-domain or paste artifact`);
  }

  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, block] of jsonLdBlocks) {
    try { JSON.parse(block); }
    catch { fail(`${route} contains invalid JSON-LD`); }
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/gi)].map(match => match[1]);
  for (const href of hrefs) {
    const target = normalizeInternalPath(href, route);
    if (!target || target.startsWith('/_astro/')) continue;
    const targetFile = target.endsWith('/')
      ? routeFile(target)
      : join(dist, target.replace(/^\//, ''));
    if (!existsSync(targetFile)) fail(`${route} links to missing internal target ${href}`);
  }
}

for (const route of forbiddenRoutes) {
  if (routeExists(route)) fail(`forbidden/conditional route was emitted: ${route}`);
}

const notFoundFile = join(dist, '404.html');
if (!existsSync(notFoundFile)) {
  fail('404.html is missing');
} else {
  const notFound = readFileSync(notFoundFile, 'utf8');
  const robots = extract(notFound, /<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)
    || extract(notFound, /<meta[^>]+content="([^"]+)"[^>]+name="robots"/i);
  if (!robots.includes('noindex,nofollow')) fail('404.html must always be noindex,nofollow');
}

const headersFile = join(dist, '_headers');
if (!existsSync(headersFile)) {
  fail('_headers is missing from the static output');
} else {
  const headers = readFileSync(headersFile, 'utf8');
  for (const required of ['X-Content-Type-Options: nosniff','Referrer-Policy: strict-origin-when-cross-origin','Permissions-Policy:']) {
    if (!headers.includes(required)) fail(`_headers is missing required security header: ${required}`);
  }
}

const robotsFile = join(dist, 'robots.txt');
const sitemapFile = join(dist, 'sitemap.xml');
if (!existsSync(robotsFile)) fail('robots.txt is missing');
if (!existsSync(sitemapFile)) fail('sitemap.xml is missing');

if (existsSync(robotsFile)) {
  const robots = readFileSync(robotsFile, 'utf8');
  if (siteUrl && !robots.includes('Allow: /')) fail('production robots.txt should allow crawling');
  if (!siteUrl && !robots.includes('Disallow: /')) fail('development robots.txt should disallow crawling');
}

if (existsSync(sitemapFile)) {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  if (siteUrl) {
    for (const route of canonicalRoutes) {
      const expected = new URL(route, siteUrl).toString();
      if (!sitemap.includes(expected)) fail(`sitemap is missing ${expected}`);
    }
  } else if (/<url>/.test(sitemap)) {
    fail('development sitemap should be empty before PUBLIC_SITE_URL is configured');
  }
}

if (!process.exitCode) {
  console.log(`SEO/GEO audit passed for ${canonicalRoutes.length} canonical routes.`);
}
