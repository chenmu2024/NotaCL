import { isPreviewHost } from '../functions/_middleware.js';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');

function normalizeAuditSiteOrigin(value) {
  const raw = value?.trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return '';
    if (url.pathname !== '/' && url.pathname !== '') return '';
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.pages.dev') || host.endsWith('.vercel.app')) return '';
    return url.origin;
  } catch {
    return '';
  }
}

const siteUrl = normalizeAuditSiteOrigin(process.env.PUBLIC_SITE_URL);

const canonicalRoutes = [
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

const forbiddenRoutes = [
  '/tabla-de-notas/',
  '/puntaje-a-nota/',
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

if (!isPreviewHost('notacl.pages.dev') || !isPreviewHost('preview.notacl.pages.dev') || isPreviewHost('notacl.cl')) {
  fail('Cloudflare preview-host middleware classification is incorrect');
}

const titles = new Map();
const descriptions = new Map();

for (const route of canonicalRoutes) {
  const html = readRoute(route);
  if (!html) continue;

  if (!/<html[^>]+lang="es-CL"/i.test(html)) fail(`${route} is missing lang="es-CL"`);

  const h1Count = countMatches(html, /<h1\b/gi);
  if (h1Count !== 1) fail(`${route} must contain exactly one H1, found ${h1Count}`);

  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) fail(`${route} is missing a title`);
  if (title.length < 20 || title.length > 70) fail(`${route} title length is ${title.length}; expected 20–70 characters internal review range`);
  if (titles.has(title)) fail(`${route} duplicates title used by ${titles.get(title)}: ${title}`);
  else titles.set(title, route);

  const description = extract(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/i)
    || extract(html, /<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
  if (description.length < 70 || description.length > 180) {
    fail(`${route} meta description length is ${description.length}; expected 70–180 characters`);
  }
  if (descriptions.has(description)) fail(`${route} duplicates meta description used by ${descriptions.get(description)}`);
  else descriptions.set(description, route);

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
  const jsonLd = [];
  for (const [, block] of jsonLdBlocks) {
    try { jsonLd.push(JSON.parse(block)); }
    catch { fail(`${route} contains invalid JSON-LD`); }
  }

  const schemaTypes = new Set(jsonLd.map((item) => item?.['@type']).filter(Boolean));
  if (!schemaTypes.has('WebSite')) fail(`${route} is missing WebSite structured data`);
  if (!schemaTypes.has('Organization')) fail(`${route} is missing Organization structured data`);

  if (['/','/generador-de-notas/','/escala-de-notas/','/escala-de-notas/60/','/promedio-de-notas/','/notas-con-porcentaje/','/que-nota-necesito/'].includes(route) && !schemaTypes.has('WebApplication')) {
    fail(`${route} is missing WebApplication structured data`);
  }

  if (route.startsWith('/guias/') && route !== '/guias/' && !schemaTypes.has('Article')) {
    fail(`${route} is missing Article structured data`);
  }

  if (siteUrl && route !== '/' && !schemaTypes.has('BreadcrumbList')) {
    fail(`${route} is missing BreadcrumbList structured data in production-like output`);
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

const routesFile = join(dist, '_routes.json');
if (!existsSync(routesFile)) {
  fail('_routes.json is missing from the static output');
} else {
  try {
    const routesConfig = JSON.parse(readFileSync(routesFile, 'utf8'));
    if (routesConfig.version !== 1) fail('_routes.json must use version 1');
    if (!Array.isArray(routesConfig.include) || !routesConfig.include.includes('/*')) fail('_routes.json must include site routes');
    if (!Array.isArray(routesConfig.exclude) || !routesConfig.exclude.includes('/_astro/*')) fail('_routes.json must exclude hashed static assets');
  } catch {
    fail('_routes.json is not valid JSON');
  }
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

const astroAssets = join(dist, '_astro');
if (existsSync(astroAssets)) {
  const assetFiles = readdirSync(astroAssets)
    .map((name) => ({ name, size: statSync(join(astroAssets, name)).size }))
    .filter((item) => item.name.endsWith('.js') || item.name.endsWith('.css'));

  const jsFiles = assetFiles.filter((item) => item.name.endsWith('.js'));
  const cssFiles = assetFiles.filter((item) => item.name.endsWith('.css'));
  const totalJs = jsFiles.reduce((sum, item) => sum + item.size, 0);
  const totalCss = cssFiles.reduce((sum, item) => sum + item.size, 0);

  for (const item of jsFiles) {
    if (item.size > 40 * 1024) fail(`client JS chunk exceeds 40 KB internal budget: ${item.name} (${item.size} bytes)`);
  }
  if (totalJs > 120 * 1024) fail(`total built client JS exceeds 120 KB internal budget: ${totalJs} bytes`);
  if (totalCss > 80 * 1024) fail(`total built CSS exceeds 80 KB internal budget: ${totalCss} bytes`);
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
