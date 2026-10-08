import { afterEach, describe, expect, it, vi } from 'vitest';

const originalExitCode = process.exitCode;

afterEach(() => {
  process.exitCode = originalExitCode;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function runAudit(scenario = '') {
  vi.resetModules();
  process.exitCode = 0;
  vi.stubEnv('PRODUCTION_URL', 'https://notacl.example');
  vi.stubEnv('PREVIEW_URL', 'https://preview.pages.dev');
  vi.stubEnv('ALTERNATE_ORIGIN', 'https://www.notacl.example');
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
  const pages = [];
  vi.stubGlobal('fetch', vi.fn(async (input, options) => {
    expect(options.signal).toBeInstanceOf(AbortSignal);
    const url = new URL(input);
    const headers = {
      'Content-Language': 'es-CL',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    };
    let status = 200;
    let body = '';
    if (url.hostname === 'preview.pages.dev') {
      headers['X-Robots-Tag'] = 'noindex, nofollow';
      if (scenario === 'broken-preview') status = 403;
      if (scenario === 'indexable-preview') delete headers['X-Robots-Tag'];
    } else if (url.hostname === 'www.notacl.example' || url.pathname === '/escala-de-notas') {
      status = 308;
      headers.Location = url.hostname.startsWith('www.') ? 'https://notacl.example/' : `${url.href}/`;
      if (scenario === 'bad-redirect') headers.Location = 'https://wrong.example/';
    } else if (url.pathname === '/__notacl_release_audit_missing__/') {
      status = scenario === 'soft-404' ? 200 : 404;
      headers['X-Robots-Tag'] = 'noindex';
    } else if (url.pathname === '/robots.txt') {
      body = 'User-agent: *\nAllow: /\nSitemap: https://notacl.example/sitemap.xml';
      if (scenario === 'blocked-robots') body += '\nDisallow: /';
    } else if (url.pathname === '/sitemap.xml') {
      body = `<urlset>${pages.map(page => `<url><loc>${page}</loc></url>`).join('')}</urlset>`;
      if (scenario === 'missing-sitemap') body = '<urlset/>';
    } else {
      pages.push(url.href);
      const robots = scenario === 'noindex-meta' ? 'noindex,follow' : 'index,follow';
      const canonical = scenario === 'bad-canonical' ? 'https://wrong.example/' : url.href;
      body = `<link rel="canonical" href="${canonical}"><meta name="robots" content="${robots}">`;
      if (scenario === 'noindex-header') headers['X-Robots-Tag'] = 'googlebot: NOINDEX, follow';
      if (scenario === 'none-header') headers['X-Robots-Tag'] = 'none';
      if (scenario === 'missing-security') delete headers['X-Frame-Options'];
      if (scenario === 'network-failure') throw new Error('simulated network failure');
    }
    const response = new Response(body, { status, headers });
    Object.defineProperty(response, 'url', { value: url.href });
    return response;
  }));
  await import('./audit-production.mjs');
  return errors.mock.calls.flat().join('\n');
}

describe('production release audit', () => {
  it('accepts working canonical pages, redirects, sitemap, 404 and blocked preview', async () => {
    expect(await runAudit()).toBe('');
    expect(process.exitCode).toBe(0);
  });

  it.each([
    ['noindex-meta', 'not indexable in production HTML'],
    ['noindex-header', 'blocked by X-Robots-Tag'],
    ['none-header', 'blocked by X-Robots-Tag'],
    ['blocked-robots', 'robots.txt blocks production crawling'],
    ['broken-preview', 'preview origin returned HTTP 403'],
    ['indexable-preview', 'missing X-Robots-Tag'],
    ['bad-redirect', 'trailing-slash redirect expected'],
    ['soft-404', 'missing URL must return HTTP 404'],
    ['bad-canonical', 'canonical mismatch'],
    ['missing-sitemap', 'sitemap.xml is missing'],
    ['missing-security', 'missing security response header'],
    ['network-failure', 'request failed'],
  ])('rejects %s', async (scenario, message) => {
    expect(await runAudit(scenario)).toContain(message);
    expect(process.exitCode).toBe(1);
  });
});
