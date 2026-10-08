# NotaCL SEO/GEO Release Evidence

Reviewed 2026-10-08 against [Website-Starter-Standard](https://github.com/chenmu2024/Website-Starter-Standard), its SEO/GEO quality gate, and Google's primary documentation. The production site is **https://notacl.cl/**; contact is **contact@notacl.cl**. Earlier pre-domain release notes are superseded by this record.

## L1 — current standard-review code

- `npm run test`: **71 tests in 8 files passed**.
- `npm run check`: **66 files, 0 errors, warnings or hints**.
- Build and SEO/GEO audit passed in all three configurations: missing origin, `pages.dev` preview origin, and `https://notacl.cl` production origin.
- **23 content routes + noindex 404**; production sitemap has **23 URLs**, including `/escala-de-notas/60/`. No route is pending indexation.
- Keyword audit: **130 queries** classified as 107 covered, 1 variant, 1 limited, 1 preset and 20 intentional exclusions. No approved intent or metric was changed.
- Raw HTML: unique titles/descriptions, one H1, heading hierarchy, working internal links, correct canonical/hreflang/robots, matching visible FAQs and JSON-LD, and default calculator answers all pass.
- Shared social preview: real **1200×630 PNG, 36,559 bytes**, absolute Open Graph/Twitter URLs, dimensions and alternative text; absent origin never invents a public image origin.
- All three guides use explicit, visible review dates matching `Article.dateModified`, with visible NotaCL authorship. The shell no longer substitutes a global release date for an article review.
- Comparison guide now distinguishes an approximate simple average from an exact weighted result and shows the formulas and the 100% weighting assumption; outputs remain derived from `src/lib/calculators/core`.
- Maximum production raw HTML **31.3 KB**; client JS **42.2 KB**; CSS **33.4 KB**. Social metadata adds no client JS or in-page image load.
- Preview/missing-origin output remains noindex, without canonical and with an empty sitemap; edge preview/404/308 checks pass.

## L2 — browser/release evidence

Current standard-review code was tested in an actual Edge browser via the local production build:

- **23 pages × 360/768/1280px = 69 responsive cases** passed.
- One H1 per page; no document-level horizontal overflow or browser execution errors.
- Automated mobile WCAG A/AA checks: no detected violations. This is not a human accessibility certification.
- Comparison table remains keyboard-focusable and scrollable on mobile.
- Zero Cloudflare/Google analytics requests, preserving the owner's explicit choice.
- Social PNG and changed mobile guide were visually inspected.

The same production contract is enforced by `npm run audit:production` after deployment. The final deployment ID, live page/asset verification and accepted snapshot are saved with the owner's workspace release outputs; do not infer a new live deployment merely from a successful local build.

## Established production baseline

Before this standard-review change, a fresh crawl of https://notacl.cl on 2026-10-08 captured **23 public pages**, then an immediate comparison reported no drift. Previous merged releases are [PR #2](https://github.com/chenmu2024/NotaCL/pull/2) and [PR #3](https://github.com/chenmu2024/NotaCL/pull/3). Their established production checks cover working calculator flows, share fragments, local storage failure cases, CSV/print/PDF, 404/308, preview exclusion, and no analytics.

The same-day pre-review mobile Lighthouse snapshot on home, generator, weighted-average and NEM pages scored **100 in each of performance/accessibility/best-practices/SEO**, LCP 1.15–1.32s, CLS 0 and TBT 0. These are dated lab measurements, not field INP/CrUX data or a prediction of ranking.

Repeatable drift checks are now available:

```sh
# Set PRODUCTION_URL=https://notacl.cl in your shell first.
npm run seo:baseline -- /path/to/accepted-snapshot.json
npm run seo:drift -- /path/to/accepted-snapshot.json
```

Snapshots record sitemap membership, raw HTML metadata, headings, canonical/indexation, hreflang, structured-data fingerprints, visible-text fingerprints and internal links. Comparison is read-only; changes return nonzero for review. Explicitly replace a snapshot only after accepting the intended release changes. Baselines contain public site data and stay with release outputs outside application source.

## L3 — ongoing operations, not incomplete development

Search Console ownership/submission, actual indexation/rank/CTR, AI citations, earned referring links and field Core Web Vitals require real search/traffic data. Review those after launch; none is used to withhold otherwise approved pages. Analytics remains disabled by owner choice.

Refresh admissions sources using `SOURCE-REGISTRY.md`; adjust titles/content only against actual query intent and evidence. `www` is an optional alias that has not been configured; the selected apex origin is already canonical and live. Email delivery has not been tested by sending mail.

## Evidence discipline

- [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features): existing SEO fundamentals apply; no special AI schema/file is required.
- [Google publication-date guidance](https://developers.google.com/search/docs/appearance/publication-dates): visible and structured dates must describe the actual page review/update.
- [Open Graph protocol](https://ogp.me/): actual image URL and image descriptors support social previews.
- Byte budgets, title-length review ranges and snapshot comparisons are project heuristics, not Google ranking requirements.
