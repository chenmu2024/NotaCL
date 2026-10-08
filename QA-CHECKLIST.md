# NotaCL Final QA Checklist

Latest local development evidence: see `DEVELOPMENT-PROGRESS.md`. Deployed-host checkboxes below remain pending.

## Product / math
- [x] Core calculation flows are implemented end-to-end.
- [x] Blank-row result invalidation, same-document share restoration, browser Back and missing shared grades checked in Edge.
- [x] Score→grade formula is isolated from UI code.
- [x] Simple average, weighted average, required grade and projected scenarios are tested.
- [x] 3.95 / 5.25 rounding boundaries are tested.
- [x] Exigencia 0/100, score > max, invalid grade config, comma parsing and 33.3% × 3 are tested.
- [x] Grades outside 1,0–7,0 are rejected in average/weighted/reverse-grade tools.
- [x] Public worked examples on key tool pages are derived from the same calculator engine.
- [x] localStorage saved-subject parsing handles corrupt and oversized data.
- [x] Generator CSV export and browser-print workflow are implemented.
- [ ] Core interactions rechecked on the deployed current build.

## Design system
- [x] Project-specific `DESIGN.md` exists and reflects the current bold editorial utility direction.
- [x] Shared colors, spacing, typography and component classes are used.
- [x] No decorative gradients / glow / glassmorphism.
- [x] Home calculator/result is the visual priority.
- [x] Mobile navigation exists instead of simply hiding desktop links.
- [ ] 360px / large mobile / tablet / desktop / wide desktop visually checked on current deployment.
- [x] Local Edge four-page A4 export visually checked; 101 rows and repeated headers verified. Deployed-browser print check remains pending.

## SEO / GEO
- [x] Approved keyword set and source are documented.
- [x] 130 supplied/named queries individually classified with built-page/anchor/topic evidence; all 10 formerly deferred queries implemented; excluded queries remain explicit.
- [x] Intent-to-canonical-page map exists.
- [ ] Full Chile Google Top10 overlap gate reproduced. Existing 60% route has only representative SERP/page-type evidence; final indexation decision remains pending.
- [x] Tabla and puntaje intents remain consolidated instead of creating duplicate routes.
- [x] Unique title / description / single H1 are enforced by the build audit.
- [x] Crawlable static primary content and internal links are present.
- [x] Canonical/robots behavior is tested in both fail-closed and production-like builds.
- [x] Sitemap includes only approved routes and emits `lastmod`; the pending 60% page remains noindex and excluded even in production-like builds.
- [x] Structured data syntax and expected page types are enforced.
- [x] BreadcrumbList is emitted for nested production-like pages.
- [x] 404 is always noindex.
- [x] Source registry documents changing factual claims and refresh rules.
- [x] Decreto 67 is used only for the school context it actually covers; 60% is explicitly not presented as a national requirement.
- [ ] Final .cl canonical, robots, sitemap and preview-host rules verified in production.

## Security / privacy
- [x] No database/account is required for calculator use.
- [x] Saved local values are escaped before dynamic HTML rendering.
- [x] Saved data is schema-validated and bounded.
- [x] Cloudflare static security headers are included.
- [x] Privacy / cookies / terms / About pages contain production-facing explanations.
- [ ] Any future analytics/AdSense consent behavior documented and tested before activation.

## Performance / accessibility
- [x] System font stack; no remote font dependency.
- [x] Calculator client bundles remain small and isolated.
- [x] Skip link, visible focus and aria-live result regions are implemented.
- [x] Active navigation uses `aria-current`.
- [x] Reduced-motion rule exists.
- [ ] Keyboard flow checked in deployed browser.
- [ ] Lighthouse/lab LCP, INP and CLS measured on final deployed host.

## Deterministic CI
- [x] `npm run test` — 61 tests, including 15 production-audit success/failure scenarios and downloadable-scale parity
- [x] `npm run check`
- [x] `npm run build`
- [x] `npm run audit`
- [x] Production-like canonical build + audit
- [x] Preview-host and production-like URL modes are both exercised in CI.
- [ ] Final production URL verified after domain connection.

- [x] Admissions formula tests cover all NEM rows, Ranking branches, invalid contexts, university presets, blank inactive factors, electiva choice, 100% totals and DUOC boundaries.

- [x] Seven admissions/DUOC routes pass 360/768/1280px layouts, live calculations, invalid-value clearing, program changes and admissions fragment restoration.

- [x] Core review regression: malformed elective text must clear results and block sharing; genuinely absent elective and inactive test remain allowed.
- [x] Required-grade/projection individual weights above 100 are rejected. Exactly achievable 7.0 remains reachable; a genuinely higher requirement remains impossible.
