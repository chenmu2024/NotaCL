# NotaCL development progress — 2026-10-08

Baseline: `aff4b657937db7492065edcc36c7dc539d22935d` on `main`.

## Completed against the supplied Chile plan

- Retained the existing 17-page Astro static site and approved URL ownership.
- Added selectable 0–3 display decimals and half-up/truncation rules to the generator, simple average and weighted average. Shared fragments retain these settings.
- Kept passing status tied to the calculated grade, independently of display rounding.
- Corrected the required-exam minimum: 5.0 at 70% with a 5.4 target needs 6.4 at one decimal; 6.3 produces only 5.39. The UI and worked example now agree.
- Added optional weighted-subject storage: names, grades, weights, average and update date; load, delete and clear actions. Existing simple-subject storage remains readable.
- Put saved subjects after the result, so mobile users see the answer before optional storage controls.
- Reject malformed decimal input, nonfinite scale settings, invalid saved grades/weights/dates and grades outside 1.0–7.0.
- Print output identifies the rounding rule and precision. Invalid tables cannot be printed using the generator action.
- Native-sharing failures now fall back to the clipboard; if both APIs are unavailable, the address bar contains the fragment for manual copying. Cancellation is respected.
- Updated Astro to 7.3.7 and Vitest to 5.0.3 after checking the official migration guides. Added the dependency lockfile and switched CI to `npm ci`.

## Verification on the changed code

- 30 unit tests pass across 4 files.
- Astro check: 0 errors, warnings or hints.
- 17 static pages build successfully.
- Build SEO/GEO audit passes without a production origin, with a pages.dev preview origin, and with the production-like test origin `https://notacl.example`.
- npm dependency audit: 0 known vulnerabilities at verification time.
- Headless Microsoft Edge browser checks: average and weighted precision/truncation; local save/reload/load; invalid input; weighted fragment share/restore; required-grade minimum/impossible/zero-weight paths; generator CSV and invalid exigency; fixed-60% protection; mobile menu; keyboard skip link; print-media layout.
- Additional Edge checks pass for clearing/corrupt/blocked local storage, native-share failure, clipboard failure and manual fragment copying.
- Local mobile Lighthouse: performance 100, accessibility 100, best practices 100; CLS 0 and TBT 0 ms. Preview SEO score is reduced intentionally by noindex/blocked crawling. This is lab evidence, not field INP/CWV certification.
- Fixed measured homepage small-text contrast failures using existing design tokens and removed the logo accessible-name override that disagreed with visible text.
- 40 responsive checks: 8 main routes at 360, 390, 768, 1280 and 1536px, without page-level horizontal overflow.
- Screenshots reviewed for the homepage, weighted calculator and generator print layout. This is local browser evidence, not final deployed-host evidence or paginated PDF certification.

## Remaining before public launch

The owner confirmed that the final domain has not been purchased.

1. Purchase/choose the final `.cl` domain and connect Cloudflare Pages.
2. Configure `PUBLIC_SITE_URL`, rebuild, and run the live production audit with actual production, alternate and preview origins.
3. Verify real HTTP statuses, redirects, preview noindex headers and mobile/print behavior on that deployment.
4. Record Lighthouse/lab metrics; field INP/CWV requires real traffic and cannot be certified from this local build.
5. Verify Search Console and submit the final sitemap.
6. Choose analytics/advertising providers and consent requirements before activation; no provider IDs or account configuration were supplied, so tracking and AdSense remain inactive.
7. Existing SERP decisions have representative results rather than a full reproducible Chile Google Top10 overlap export. Preserve current routes, avoid claiming a fresh exhaustive SERP gate, and obtain that evidence before expanding conditional URLs.

Do not mark the full website/launch goal complete while these release checks remain outstanding.
