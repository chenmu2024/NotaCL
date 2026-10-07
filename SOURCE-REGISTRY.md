# NotaCL Source / Evidence Registry

This file records factual or time-sensitive claims used in public pages. It is intentionally separate from keyword metrics and from first-party calculator formulas.

| Page / area | Claim or data | Evidence class | Source | Checked | Refresh rule | Fallback |
|---|---|---|---|---|---|---|
| `/guias/concentracion-de-notas-ensenanza-media/` | What the concentration of secondary-school grades certificate contains and where the official process is handled | Official requirement / primary source | Ayuda Mineduc — https://ayudamineduc.cl/ficha/concentracion-de-notas-4 | 2026-10-07 | Recheck at least annually and before materially changing the guide | If the source changes or cannot be verified, remove procedural details and keep only a link to the current Mineduc help portal |
| Core grade calculators | Initial values 1,0 minimum / 4,0 passing / 7,0 maximum / 60% exigency | Product assumption, not a nationwide official rule | First-party configurable model documented in the UI and tests | 2026-10-07 | Review when product defaults change | Keep parameters editable and keep the visible limitation that institutions may use different rules |
| Rounding guide / calculators | Half-up rounding examples such as 5,25 → 5,3 when displaying one decimal | First-party calculator behavior, not a Chile-wide policy claim | `src/lib/calculators/core.ts` + automated tests | 2026-10-07 | Recheck whenever rounding code changes | Preserve exact result separately and avoid claiming an institution must use the same rule |

## Keyword/competitor evidence

Keyword Volume/KD/CPC and competitor traffic metrics are owner-provided Semrush Chile exports/screenshots from the opportunity-research workflow. They are documented in `SEO-GEO-PROJECT-BRIEF.md` and must not be silently replaced or invented.

## Publication rule

Any new page containing a changing institutional rule, admissions conversion, NEM/PAES table, university-specific algorithm, fee, deadline, or procedural requirement must be added to this registry before it is made indexable.
