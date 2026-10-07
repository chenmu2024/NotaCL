export function normalizeSiteOrigin(value: string | undefined | null): string {
  const raw = value?.trim();
  if (!raw) return '';

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return '';
    if (url.username || url.password || url.search || url.hash) return '';
    if (url.pathname !== '/' && url.pathname !== '') return '';
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.pages.dev') || host.endsWith('.vercel.app')) return '';
    return url.origin;
  } catch {
    return '';
  }
}
