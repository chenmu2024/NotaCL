# NotaCL SEO/GEO Release Evidence

Status: development baseline verified in GitHub CI. Production-host checks remain pending until the final .cl domain is connected.

## L1 deterministic evidence

- [x] `npm run test` — GitHub Actions CI run #34, success
- [x] `npm run check` — GitHub Actions CI run #34, success
- [x] `npm run build` — GitHub Actions CI run #34, success
- [x] Core routes compile into the static Astro build
- [x] Development indexation fails closed: without `PUBLIC_SITE_URL`, output is `noindex,nofollow` and robots disallows crawling
- [ ] Raw production HTML title/H1/canonical/robots checked after final domain build
- [ ] Production sitemap checked after final domain build
- [ ] Production missing path returns real 404 after deploy

Verification commit: `18ac49a41efc73d225befaf211d686ed66286543`
CI run: `https://github.com/chenmu2024/NotaCL/actions/runs/37596132718`

## L2 manual/visual evidence

- [ ] 360px mobile on deployed preview
- [ ] 768px tablet on deployed preview
- [ ] 1280px desktop on deployed preview
- [ ] Keyboard/focus flow
- [ ] Tool result clarity
- [ ] Table overflow behavior
- [ ] No generic AI-SaaS decoration
- [x] No intent-duplicate routes shipped for tabla/puntaje/60% variants

## Production evidence

- Production URL: TBD
- Deployment date: TBD
- GSC property: TBD
- Sitemap submission: TBD
- pages.dev/preview index protection: TBD
- Baseline CWV/lab snapshot: TBD
