# NotaCL

Herramientas gratuitas para calcular notas, escalas, promedios y ponderaciones en Chile.

## Stack

- Astro + TypeScript
- Static generation
- Browser-side calculators
- localStorage only for optional saved subjects
- Cloudflare Pages
- No database, no accounts, no paid APIs

## Current development status

See `DEVELOPMENT-PROGRESS.md` for the plan comparison, latest verification and launch dependencies.

## Local development

```bash
npm ci
npm run dev
npm run test
npm run check
npm run build
npm run audit
```

`npm run audit` inspects the built HTML, routes, robots/canonical behavior, structured data, sitemap coverage, internal links, 404 indexation and Cloudflare static headers.

## Production indexing

Set `PUBLIC_SITE_URL` in Cloudflare Pages to the final canonical `.cl` origin before launch. If it is absent, public pages output `noindex,nofollow` and the sitemap stays empty, so a temporary Pages deployment fails closed instead of accidentally becoming the canonical production site.

`pages.dev`/preview host blocking must also be enforced at Cloudflare host/rule level before launch; canonical tags alone are not treated as sufficient protection.

## Canonical SEO architecture

Current approved search-intent routes:

- `/` — calculadora / calculador de notas
- `/generador-de-notas/` — full grading-scale generator
- `/escala-de-notas/` — configurable score-to-grade scale
- `/escala-de-notas/60/` — fixed 60% exigency scale; final independent indexation remains pending the complete Google Chile Top10 gate
- `/promedio-de-notas/` — simple average
- `/notas-con-porcentaje/` — weighted average
- `/que-nota-necesito/` — reverse required-grade calculation

`/tabla-de-notas/`, `/puntaje-a-nota/` and `/escala-de-notas/50/` remain intentionally unshipped until search-result evidence justifies separate canonical pages.

See `SEO-GEO-PROJECT-BRIEF.md` and `SERP-DECISIONS.md`.

## Trust and factual sources

- Changing institutional/public claims must be registered in `SOURCE-REGISTRY.md`.
- The configurable calculator formula is first-party product logic, not presented as a universal Chilean rule.
- Decreto 67 is used only for the school context it actually covers; the 60% exigency remains a configurable/product-specific assumption rather than a claimed nationwide requirement.

## Release gate

CI verifies both:

1. fail-closed output without `PUBLIC_SITE_URL`;
2. production-like canonical/indexable output using a test origin.

Production release still requires the real `.cl` host to pass visual/mobile, status-code, CWV, canonical, sitemap and preview-host checks.
