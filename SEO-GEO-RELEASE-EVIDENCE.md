# NotaCL SEO/GEO Release Evidence

Status: deterministic development/release checks pass on the current codebase. Real production-host and browser L2 checks remain pending until the final .cl domain is connected.

## Current development evidence

See `DEVELOPMENT-PROGRESS.md` and https://github.com/chenmu2024/NotaCL/pull/1 for the current changes, 30-test suite and local browser/lab evidence. The CI run below is retained as historical evidence, not the current revision.

## Historical L1 deterministic evidence

Verified on GitHub Actions CI run #227, commit `d925d4f996b7e3517c5b2538e775a905ce1e8f53`.

- [x] `npm run test` — 3 test files, 19 tests passed
- [x] `npm run check` — 39 files checked, 0 errors, 0 warnings
- [x] `npm run build` — 17 static pages built
- [x] `npm run audit` with no `PUBLIC_SITE_URL`: fail-closed output verified
- [x] Preview-host rebuild with `PUBLIC_SITE_URL=https://notacl.pages.dev`: still fails closed
- [x] Production-like rebuild with `PUBLIC_SITE_URL=https://notacl.example`: canonical/indexable output verified
- [x] Core routes compile into static Astro output
- [x] Exactly one H1 on each audited canonical route
- [x] Unique titles and meta descriptions across audited canonical routes
- [x] Internal crawlable links resolve within the static output
- [x] Conditional duplicate routes remain absent except approved `/escala-de-notas/60/`
- [x] JSON-LD parses; expected WebSite / Organization / WebApplication / Article / BreadcrumbList page classes are enforced
- [x] Core calculator pages expose useful default outputs in raw HTML, not only after client JavaScript runs
- [x] Development and preview-host output is `noindex,nofollow`, emits no canonical and produces an empty sitemap
- [x] Production-like output emits expected canonicals and sitemap membership
- [x] 404 HTML is noindex and edge middleware adds noindex to 4xx/5xx responses
- [x] Cloudflare `_headers` and `_routes.json` baselines are emitted and audited
- [x] Edge middleware trailing-slash and preview-host behavior is executed in CI
- [x] Sitemap includes `lastmod`
- [x] Source registry exists for changing institutional claims
- [x] SERP decisions are documented for generic scale / 60% / tabla / puntaje / homepage-vs-promedio consolidation
- [x] Static asset budgets pass

Historical lab/build-size evidence from run #227:
- Maximum audited raw HTML: **21.5 KB** in the production-like build
- Total client JavaScript: **19.8 KB**
- Total CSS: **32.2 KB**

CI evidence: https://github.com/chenmu2024/NotaCL/actions/runs/37610391442

## L2 manual / release evidence

Pending on the deployed current build:

- [ ] 360px small mobile
- [ ] large mobile
- [ ] 768px tablet
- [ ] 1280px desktop
- [ ] wide desktop
- [ ] Keyboard/focus flow in a real browser
- [ ] Mobile menu behavior
- [ ] Calculator result hierarchy and error states
- [ ] Generator print/PDF layout
- [ ] Table horizontal overflow on mobile
- [ ] No page-level accidental overflow
- [ ] Lab LCP / INP / CLS measurement
- [ ] Real missing URL returns HTTP 404
- [ ] Real production robots.txt and sitemap return 200
- [ ] Real production canonical host is the final .cl
- [ ] Real `pages.dev` response includes `X-Robots-Tag: noindex, nofollow`
- [ ] Apex/www redirect policy verified on the final domain

## Production evidence

- Production URL: TBD
- Deployment date: TBD
- GSC property: TBD
- Sitemap submission: TBD
- Preview-host response verification: TBD
- Baseline CWV/lab snapshot: TBD
- Accepted visual baseline: TBD

## L3 post-launch

Run after enough real traffic/indexing data exists:

- Search Console query/page/index coverage
- Cannibalization review
- GSC country/device/CTR/position changes
- CrUX field data when available
- Backlink/brand-mention review when reliable data is available
- Drift comparison against the accepted production baseline
