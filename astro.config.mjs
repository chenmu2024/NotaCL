import { defineConfig } from 'astro/config';

function productionOrigin(value) {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return undefined;
    if (url.pathname !== '/' && url.pathname !== '') return undefined;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.pages.dev') || host.endsWith('.vercel.app')) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

const site = productionOrigin(process.env.PUBLIC_SITE_URL);

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    build: { cssMinify: true }
  }
});
