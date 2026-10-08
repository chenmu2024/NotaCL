import { describe, expect, it } from 'vitest';
import { compareBaselines, extractPage } from './seo-baseline.mjs';

const url = 'https://notacl.example/';
const html = `<title>NotaCL calculator</title><meta content="Useful grade calculator" name="description">
<link href="${url}" rel="canonical"><meta name="robots" content="index,follow">
<script type="application/ld+json">{"@type":"WebApplication"}</script>
<main><h1>Grade calculator</h1><p>Default grade: 5.25</p><a href="/guide/#formula">Formula</a><a href="mailto:contact@notacl.cl">Contact</a><script>temporaryState=1</script></main>`;

describe('production SEO baseline', () => {
  it('reads raw HTML metadata regardless of attribute order and includes crawlable fragments', () => {
    const page = extractPage(html, url);
    expect(page.title).toBe('NotaCL calculator');
    expect(page.description).toBe('Useful grade calculator');
    expect(page.internalLinks).toEqual(['/guide/#formula']);
    expect(page.schemaTypes).toEqual(['WebApplication']);
  });
  it.each([
    html.replace('index,follow', 'noindex,follow'),
    html.replace(`href="${url}"`, 'href="https://wrong.example/"'),
    html.replace('<h1>Grade calculator</h1>', ''),
    html.replace('</main>', '<h1>Duplicate</h1></main>'),
    html.replace('{"@type":"WebApplication"}', '{invalid}'),
  ])('rejects an invalid production page', (broken) => {
    expect(() => extractPage(broken, url)).toThrow();
  });
  it('rejects HTTP-level noindex even when the HTML is indexable', () => {
    expect(() => extractPage(html, url, new Headers({ 'X-Robots-Tag': 'googlebot: none' }))).toThrow();
  });
  it('ignores client script changes but detects an altered visible answer', () => {
    const page = extractPage(html, url);
    expect(extractPage(html.replace('temporaryState=1', 'temporaryState=2'), url).contentFingerprint).toBe(page.contentFingerprint);
    expect(extractPage(html.replace('5.25', '6.25'), url).contentFingerprint).not.toBe(page.contentFingerprint);
  });
  it('reports route removal, metadata, schema and link drift without treating capture time as a change', () => {
    const page = extractPage(html, url);
    const before = { origin: url, capturedAt: 'old', pages: { '/': page, '/guide/': page } };
    expect(compareBaselines(before, { ...before, capturedAt: 'new' })).toEqual([]);
    const after = { origin: url, pages: { '/': { ...page, title: 'Changed', internalLinks: [], schemaFingerprint: 'changed' } } };
    expect(compareBaselines(before, after)).toEqual(['/: internalLinks changed', '/: schemaFingerprint changed', '/: title changed', '/guide/: removed from sitemap']);
    expect(() => compareBaselines(before, { ...after, origin: 'https://other.example/' })).toThrow('origins differ');
    expect(compareBaselines(before, { ...before, robotsFingerprint: 'changed' })).toEqual(['robots.txt changed']);
    expect(compareBaselines(before, { ...before, pages: { ...before.pages, '/': { ...page, lastModified: '2026-10-08' } } })).toEqual(['/: lastModified changed']);
  });
});
