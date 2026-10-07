# NotaCL Cloudflare Deployment

- Production domain: TBD `.cl`
- GitHub repository: `chenmu2024/NotaCL`
- Production branch: `main`
- Framework: Astro static
- Build command: `npm run build`
- Output directory: `dist`
- Node: 22
- Required production environment variable: `PUBLIC_SITE_URL=https://FINAL-DOMAIN.cl`
- Optional environment variable: `PUBLIC_SITE_NAME=NotaCL`
- Static headers: `public/_headers`

## Before connecting the domain

1. Keep `PUBLIC_SITE_URL` unset on an ordinary temporary preview if you do not want it indexed.
2. Confirm CI passes test → check → build → audit.
3. Confirm the production-like CI build/audit passes with the test origin.
4. Do not submit a `pages.dev` URL to Search Console.

## Custom domain

1. Connect the final `.cl` to the Pages project.
2. Set `PUBLIC_SITE_URL` to the exact preferred HTTPS origin, with no path.
3. Rebuild production after setting the variable.
4. Pick one canonical host form (apex or `www`) and permanently redirect the other to it.
5. Ensure the custom domain is the only public indexable copy.

## pages.dev / preview protection

Canonical tags are not sufficient protection for duplicate preview hosts.

This repository now includes `functions/_middleware.js`. It also normalizes extensionless routes to the project's trailing-slash URL policy with a 308 redirect, so `/escala-de-notas` resolves to `/escala-de-notas/`.

On Cloudflare preview hosts it adds:

- `X-Robots-Tag: noindex, nofollow`
- `Cache-Control: no-store`

when the request hostname is `*.pages.dev`. The same helper also classifies localhost/vercel-style preview hosts as non-production for deterministic checks.

The repository also includes `public/_routes.json` so hashed `/_astro/*` assets, the favicon and the manifest bypass the middleware. This keeps edge invocations focused on documents instead of static assets.

After deployment, verify the real `pages.dev` HTTP response contains the noindex header. If Cloudflare changes Pages Functions behavior or the project moves hosts, update this middleware before allowing preview URLs to be public.

## Static response headers

`public/_headers` currently sets:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=()`
- `X-Frame-Options: DENY`
- long immutable caching for `/_astro/*`

Any future external script such as analytics or AdSense must be tested before introducing a strict CSP.

## Production release checks

- Homepage returns HTTP 200.
- Core tools and `/escala-de-notas/60/` return 200 and function.
- A nonsense URL returns a real HTTP 404.
- `/robots.txt` returns 200 and allows production crawling.
- `/sitemap.xml` returns 200 and contains only intended canonical routes.
- Every important raw HTML document contains the final `.cl` canonical.
- `pages.dev`/preview does not become indexable.
- Static JS/CSS load without mixed content.
- Mobile navigation and calculator controls work.
- Generator Print → Save as PDF produces a readable table.
- Lab LCP/INP/CLS are recorded after the final domain is live.
- GSC is verified and the sitemap is submitted only after the production host passes these checks.


## Automated live release audit

After the final domain is connected and the current build is deployed:

```bash
PRODUCTION_URL=https://FINAL-DOMAIN.cl \
ALTERNATE_ORIGIN=https://www.FINAL-DOMAIN.cl \
PREVIEW_URL=https://YOUR-PROJECT.pages.dev \
npm run audit:production
```

The command verifies the canonical routes, live canonical tags, indexability, security/language headers, trailing-slash redirect, optional apex/www alternate-host redirect, real 404 status/noindex header, robots.txt, sitemap coverage and preview-host noindex response. It does not replace visual QA, keyboard testing or Lighthouse/CWV measurement.
