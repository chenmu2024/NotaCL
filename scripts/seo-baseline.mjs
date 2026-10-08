import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const fingerprint = (value) => createHash('sha256').update(value).digest('hex');
const text = (value) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([, name, value]) => [name.toLowerCase(), value]));

export function extractPage(html, url, headers = new Headers()) {
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const robots = meta.find((tag) => tag.name === 'robots')?.content || '';
  const canonical = links.find((tag) => tag.rel === 'canonical')?.href || '';
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const headings = [...(main || '').matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(([, level, content]) => ({ level: Number(level), text: text(content) }));
  if (!main || headings.filter((heading) => heading.level === 1).length !== 1) throw new Error(`${url}: missing main content or unique H1`);
  if (canonical !== url || !robots || /\b(noindex|none)\b/i.test(`${robots} ${headers.get('x-robots-tag') || ''}`)) throw new Error(`${url}: canonical/indexation regression`);
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(([, value]) => JSON.parse(value));
  const internalLinks = [...new Set([...html.matchAll(/<a\b[^>]*>/gi)].flatMap(([tag]) => {
    const href = attributes(tag).href;
    if (!href) return [];
    const target = new URL(href, url);
    return target.origin === new URL(url).origin ? [target.pathname + target.search + target.hash] : [];
  }))].sort();
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = meta.find((tag) => tag.name === 'description')?.content || '';
  if (!title || !description) throw new Error(`${url}: missing title or description`);
  return {
    title, description, canonical, robots,
    hreflang: links.filter((tag) => tag.hreflang).map((tag) => ({ language: tag.hreflang, url: tag.href })),
    socialImage: meta.find((tag) => tag.property === 'og:image')?.content || '',
    headings,
    schemaTypes: schemas.flatMap((schema) => Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]).sort(),
    schemaFingerprint: fingerprint(JSON.stringify(schemas)),
    contentFingerprint: fingerprint(text(main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ''))),
    internalLinks,
  };
}

export function compareBaselines(before, after) {
  if (before.origin !== after.origin) throw new Error('Baseline origins differ');
  const changes = [];
  if (before.robotsFingerprint !== after.robotsFingerprint) changes.push('robots.txt changed');
  for (const route of [...new Set([...Object.keys(before.pages), ...Object.keys(after.pages)])].sort()) {
    const oldPage = before.pages[route];
    const newPage = after.pages[route];
    if (!oldPage || !newPage) changes.push(`${route}: ${oldPage ? 'removed from sitemap' : 'added to sitemap'}`);
    else for (const field of [...new Set([...Object.keys(oldPage), ...Object.keys(newPage)])].sort()) {
      if (JSON.stringify(oldPage[field]) !== JSON.stringify(newPage[field])) changes.push(`${route}: ${field} changed`);
    }
  }
  return changes;
}

async function captureBaseline(origin) {
  async function request(url) {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'NotaCL-SEO-Baseline/1.0' } });
    if (response.status !== 200) throw new Error(`${url}: HTTP ${response.status}`);
    return response;
  }
  const sitemap = await (await request(`${origin}/sitemap.xml`)).text();
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, value]) => ({
    url: new URL(value.match(/<loc>([^<]+)<\/loc>/)?.[1] || ''),
    lastModified: value.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '',
  }));
  if (!entries.length || entries.some(({ url }) => url.origin !== origin || url.search || url.hash) || new Set(entries.map(({ url }) => url.href)).size !== entries.length) throw new Error('Sitemap must contain unique clean URLs from the production origin');
  const pages = {};
  for (const { url, lastModified } of entries.sort((a, b) => a.url.pathname.localeCompare(b.url.pathname))) {
    const response = await request(url.href);
    pages[url.pathname] = { ...extractPage(await response.text(), url.href, response.headers), lastModified };
  }
  const robots = await (await request(`${origin}/robots.txt`)).text();
  return { version: 1, origin, capturedAt: new Date().toISOString(), robotsFingerprint: fingerprint(robots.replace(/\r\n/g, '\n')), pages };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [mode, file] = process.argv.slice(2);
    if (!['--write', '--compare'].includes(mode) || !file) throw new Error('Usage: seo-baseline.mjs --write|--compare <snapshot.json>; set PRODUCTION_URL');
    const url = new URL(process.env.PRODUCTION_URL || '');
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || /(^localhost$|\.pages\.dev$|\.vercel\.app$)/i.test(url.hostname)) throw new Error('PRODUCTION_URL must be a public HTTPS production origin');
    const baseline = mode === '--compare' ? JSON.parse(readFileSync(file, 'utf8')) : undefined;
    const current = await captureBaseline(url.origin);
    if (mode === '--write') {
      writeFileSync(file, JSON.stringify(current, null, 2) + '\n');
      console.log(`Saved ${Object.keys(current.pages).length} production pages to ${file}`);
    } else {
      const changes = compareBaselines(baseline, current);
      console.log(changes.length ? changes.join('\n') : `No SEO drift across ${Object.keys(current.pages).length} production pages`);
      if (changes.length) process.exitCode = 1;
    }
  } catch (error) {
    console.error(`SEO BASELINE FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
