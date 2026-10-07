import { normalizeSiteOrigin } from '../lib/site/url';
export const SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || 'NotaCL';
export const SITE_URL = normalizeSiteOrigin(import.meta.env.PUBLIC_SITE_URL);
export const INDEXING_ENABLED = Boolean(SITE_URL);
export const DEFAULT_LOCALE = 'es-CL';
export const LAST_UPDATED = '2026-10-07';

export const navItems = [
  { href: '/generador-de-notas/', label: 'Generador' },
  { href: '/escala-de-notas/', label: 'Escala' },
  { href: '/promedio-de-notas/', label: 'Promedio' },
  { href: '/notas-con-porcentaje/', label: 'Porcentaje' },
  { href: '/que-nota-necesito/', label: '¿Qué nota necesito?' },
];
