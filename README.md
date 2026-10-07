# NotaCL

Herramientas gratuitas para calcular notas, escalas, promedios y ponderaciones en Chile.

## Stack

- Astro + TypeScript
- Static generation
- Browser-side calculators
- localStorage only for optional saved calculations
- Cloudflare Pages
- No database, no accounts, no paid APIs

## Local development

```bash
npm install
npm run dev
npm run test
npm run check
npm run build
```

## Production indexing

Set `PUBLIC_SITE_URL` in Cloudflare Pages to the final canonical `.cl` origin before launch. If it is absent, pages output `noindex,nofollow` so a temporary Pages deployment cannot accidentally become the canonical production site.

`pages.dev`/preview host blocking must also be enforced at Cloudflare host/rule level before launch; canonical tags alone are not treated as sufficient protection.

## SEO architecture

One primary intent owns one canonical URL. Conditional candidates such as `/tabla-de-notas/`, `/puntaje-a-nota/` and `/escala-de-notas/60/` are intentionally not shipped as indexable routes until SERP overlap review justifies them.
