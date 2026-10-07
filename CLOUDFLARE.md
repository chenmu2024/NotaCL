# NotaCL Cloudflare Deployment

- Production domain: TBD `.cl`; set via `PUBLIC_SITE_URL`
- GitHub repository: `chenmu2024/NotaCL`
- Production branch: `main`
- Framework: Astro static
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `PUBLIC_SITE_URL=https://FINAL-DOMAIN.cl`
- Optional: `PUBLIC_SITE_NAME=NotaCL`

## Required pre-launch rules

1. Custom `.cl` must be the only indexable host.
2. `*.pages.dev` and preview deployments must redirect or emit `X-Robots-Tag: noindex`/equivalent host-level protection.
3. Verify homepage + five core tool routes, `robots.txt`, `sitemap.xml`, canonical origin and 404 behavior on the real production host.
4. Do not consider a successful Pages build equivalent to production QA.
