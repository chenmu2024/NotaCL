import { INDEXING_ENABLED, SITE_URL } from '../config/site';
export const prerender = true;
export function GET(){
  const lines = INDEXING_ENABLED ? ['User-agent: *','Allow: /',`Sitemap: ${SITE_URL}/sitemap.xml`] : ['User-agent: *','Disallow: /'];
  return new Response(lines.join('\n')+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
