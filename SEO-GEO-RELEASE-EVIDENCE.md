# NotaCL SEO/GEO Release Evidence

Status: development baseline passes deterministic L1 checks. Production-host/L2 checks remain pending until the final .cl domain is connected.

## L1 deterministic evidence

Verified on GitHub Actions CI run #137, commit `ca0a7957de377067bde1b1f74b3468668ed764e8`.

- [x] `npm run test`
- [x] `npm run check`
- [x] `npm run build`
- [x] `npm run audit` with no `PUBLIC_SITE_URL`: fail-closed output verified
- [x] Production-like rebuild with `PUBLIC_SITE_URL=https://notacl.example`
- [x] Production-like `npm run audit`: canonical/indexable output verified
- [x] Core routes compile into static Astro output
- [x] Exactly one H1 on each audited canonical route
- [x] Unique titles and valid-length meta descriptions across audited routes
- [x] Internal crawlable links resolve within the static output
- [x] Conditional duplicate routes remain absent except the approved `/escala-de-notas/60/`
- [x] JSON-LD parses; expected WebSite / Organization / WebApplication / Article / BreadcrumbList page classes are enforced
- [x] Development output is `noindex,nofollow`, emits no canonical and produces an empty sitemap
- [x] Production-like output emits expected canonicals and sitemap membership
- [x] 404 output is always `noindex,nofollow`
- [x] Cloudflare `_headers` baseline is emitted and audited
- [x] Sitemap includes `lastmod`
- [x] Source registry exists for changing institutional claims
- [x] SERP decisions are documented for escala / 60% / tabla / puntaje consolidation

CI evidence: https://github.com/chenmu2024/NotaCL/actions/runs/37606815928

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
- [ ] Real missing URL returns HTTP 404 rather than only rendering 404 content
- [ ] Real production robots.txt and sitemap return 200
- [ ] Real production canonical host is the final .cl
- [ ] pages.dev / preview host cannot become indexable

## Production evidence

- Production URL: TBD
- Deployment date: TBD
- GSC property: TBD
- Sitemap submission: TBD
- pages.dev/preview index protection: TBD
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
