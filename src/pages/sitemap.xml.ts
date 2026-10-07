import { INDEXING_ENABLED, SITE_URL } from '../config/site';
export const prerender = true;
const routes=['/','/generador-de-notas/','/escala-de-notas/','/promedio-de-notas/','/notas-con-porcentaje/','/que-nota-necesito/','/guias/','/guias/redondeo-de-notas/','/guias/promedio-simple-vs-ponderado/','/guias/concentracion-de-notas-ensenanza-media/','/sobre-nosotros/','/contacto/','/politica-de-privacidad/','/terminos/','/cookies/'];
export function GET(){
  const body = INDEXING_ENABLED ? `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${SITE_URL}${r}</loc></url>`).join('')}</urlset>` : '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
