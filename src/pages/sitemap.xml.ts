import { INDEXING_ENABLED, LAST_UPDATED, SITE_URL } from '../config/site';
import { pendingIndexationRoutes } from '../../seo/indexing-policy.mjs';

export const prerender = true;

const routes=[
  '/calculadora-nem/',
  '/calculadora-ranking/',
  '/calculadora-paes/',
  '/universidades/usach/',
  '/universidades/uc/',
  '/universidades/uchile/',
  '/universidades/duoc/',

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
  '/cookies/'
].filter(route=>!pendingIndexationRoutes.includes(route));

function escapeXml(value:string){
  return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

export function GET(){
  const body = INDEXING_ENABLED
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route=>`  <url><loc>${escapeXml(new URL(route,SITE_URL).toString())}</loc><lastmod>${LAST_UPDATED}</lastmod></url>`).join('\n')}\n</urlset>`
    : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';

  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
