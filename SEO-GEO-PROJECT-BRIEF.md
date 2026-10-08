# NotaCL SEO/GEO Project Brief

## Market and source discipline

- Market: Chile
- Locale: `es-CL`
- Metric source: owner-provided Semrush Chile exports/snapshots from the opportunity research conversation. Values must not be silently replaced.
- Core product claims: first-party calculator behavior. Institution-specific/NEM/PAES claims require current primary sources before indexation.

## Query-level implementation inventory

`seo/keyword-map.json` preserves the supplied query set, metrics, classifications and target sections. `KEYWORD-COVERAGE.md` explains semantic coverage and intentional exclusions. The build audit checks target pages, section anchors, topic evidence and duplicate-route prohibitions. This inventory does not replace the Google Chile Top10 gate or prove rankings.

## Approved intent ownership

| Canonical route | Primary intent | Approved keyword data |
|---|---|---|
| `/` | general grade calculator | `calculador de notas` 90,500 / KD39; `calculadora de notas` 60,500 / KD34; `calcular nota` 22,200 / KD30 |
| `/generador-de-notas/` | generate a full grading scale/table | `generador de notas` 90,500 / KD23; `tabla generadora de notas` 1,600 / KD26; `generador de escala` 1,300 / KD32; `pauta de evaluacion` 1,000 / KD21 |
| `/escala-de-notas/` | convert score to grade and inspect configurable scale/table | `escala de notas` 165,000 / KD33 / CPC 0.20; `tabla de notas` 49,500 / KD31 (consolidated secondary intent); `escala notas` 12,100 / KD23; typo `escalada de notas` 8,100 / KD24; `puntaje nota` 4,400 / KD24 (consolidated secondary intent); `escala de notas chile` 1,000 / KD31 |
| `/escala-de-notas/60/` | fixed 60% exigency scale/table | `escala de notas al 60` 27,100 / KD32; `tabla de notas al 60` 3,600 / KD27; `escala al 60` 1,000 / KD21 |
| `/promedio-de-notas/` | simple arithmetic grade average | `promedio de notas` 49,500 / KD41; `calcular promedio` 22,200 / KD40; `como sacar promedio` 8,100 / KD24; `promedio notas` 6,600 / KD36 |
| `/notas-con-porcentaje/` | weighted grades/percentages | `porcentaje de notas` 22,200 / KD37; `notas con porcentaje` 18,100 / KD29; `porcentaje notas` 18,100 / KD29; `nota con porcentajes` 18,100 / KD31; `calcular porcentaje nota` 12,100 / KD30; `calcula notas con porcentaje` 5,400 / KD28; `calcular promedio con porcentaje` 1,000 / KD17 |
| `/que-nota-necesito/` | reverse-calculate required future grade | `que nota necesito` 1,900 / KD27; related exam calculator variants are secondary only |

## Conditional/non-shipped candidates

Do not ship as separate indexable routes until Chile SERP overlap/page-type review justifies separation:
- `/tabla-de-notas/` — keyword 49,500 / KD31; currently owned as a secondary intent by `/escala-de-notas/`
- `/puntaje-a-nota/` — cluster led by `puntaje nota` 4,400 / KD24; currently owned as a secondary intent by `/escala-de-notas/`
- `/escala-de-notas/50/` — 260 / KD14

## Special handling

- `mi promedio` 74,000 / KD47 is not treated as fully addressable generic demand because `mipromedio.cl` creates likely navigational/brand intent.
- No typo route for `escalada de notas`.
- Exclude platform/login terms (`notas ulagos`, `webclass notas`, `napsis notas`, etc.), music-note terms, Redmi/Samsung Note, notaría, Death Note and unrelated `not` terms.

## Guide ownership

Only knowledge intents not already owned by tools may receive standalone guides. Initial guides:
- `/guias/redondeo-de-notas/`
- `/guias/promedio-simple-vs-ponderado/`
- `/guias/concentracion-de-notas-ensenanza-media/` (keyword 4,400 / KD29; informational only, no invented official process claims)

Do not create standalone “cómo calcular promedio”, “cómo calcular notas con porcentaje”, or “qué nota necesito en el examen” guides; those sections belong on the corresponding tool pages.

## Indexation policy

- If `PUBLIC_SITE_URL` is missing: `noindex,nofollow` globally.
- Production canonical origin comes only from `PUBLIC_SITE_URL` and must be the final `.cl` domain.
- Sitemap includes only intentionally indexable canonical routes.
- Share state uses URL fragments, not crawlable query combinations.
- `pages.dev` and preview origins are blocked from indexation by build-time fail-closed rules plus Cloudflare Pages middleware; the real deployed response still must be verified before launch.

## GEO/answer extraction

Important tool pages include: direct answer/definition near the top, explicit inputs/outputs, formula/assumptions, worked example calculated from the same engine logic, limitations, visible FAQ, related tools, and updated methodology. Schema describes only visible content; no AI-only duplicate pages or fake citations.

## Schema/entity plan

- WebSite + Organization on site shell.
- WebApplication on calculator pages.
- BreadcrumbList on nested pages.
- Article only for genuine guides.
- FAQPage only when visible FAQs are present; no promise of FAQ rich-result eligibility.

## Measurement/stop rules

90 days: core indexation ≥80%, target impressions trending, 3–5 priority queries in Top50, ≥5 long-tail Top20, ≥5 relevant referring domains. 180 days: 1–3 important clusters Top20, multiple long-tails Top10, organic clicks in the thousands/month target range. If after six months indexing/tool quality/link basics are healthy but all major terms remain >50 and clicks <500/month, stop large content expansion and shift resources.
