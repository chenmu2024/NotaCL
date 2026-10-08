# NotaCL Source / Evidence Registry

This file records factual or time-sensitive claims used in public pages. It is intentionally separate from keyword metrics and from first-party calculator formulas.

| Page / area | Claim or data | Evidence class | Source | Checked | Refresh rule | Fallback |
|---|---|---|---|---|---|---|
| `/guias/concentracion-de-notas-ensenanza-media/` | What the certificate contains, checking the availability of secondary-school certificates, missing-course requests and official online/presential channels | Official requirement / primary source | Ayuda Mineduc — https://ayudamineduc.cl/ficha/concentracion-de-notas-4 and https://certificados.mineduc.cl/mvc/home/index | 2026-10-08 | Recheck at least annually and before materially changing the guide | If the source changes or cannot be verified, remove procedural details and keep only a link to the current Mineduc help portal |
| Core school-grade context | For officially recognized formal basic/secondary education covered by Decreto 67, the annual final grade for each subject/module uses a 1.0–7.0 scale, up to one decimal, with 4.0 as the minimum passing grade | Official requirement / primary source | Biblioteca del Congreso Nacional, Decreto 67, arts. 1 and 8 — https://www.bcn.cl/leychile/Navegar?idNorma=1127255&idParte=9984568&idVersion=2018-12-31 | 2026-10-08 | Recheck annually and before changing grade-scale claims | If the decree changes, remove the legal framing until the current text is verified |
| Core grade calculators | Initial 60% exigency and the score→grade interpolation formula | Product assumption, not a nationwide official rule under Decreto 67 | First-party configurable model documented in the UI and tests; Decreto 67 art. 8 does not set a nationwide 60% exigency | 2026-10-08 | Review when product defaults change or relevant regulation changes | Keep exigency editable and state clearly that the institution/course may use another rule |
| Rounding guide / calculators | Selectable half-up and truncation presentation; required exam minimum is rounded upward to avoid undershooting the target | First-party calculator behavior, not a Chile-wide policy claim | `src/lib/calculators/core.ts` + automated tests | 2026-10-08 | Recheck whenever rounding code changes | Preserve exact result separately and avoid claiming an institution must use the same rule |

## Keyword/competitor evidence

Keyword Volume/KD/CPC and competitor traffic metrics are owner-provided Semrush Chile exports/screenshots from the opportunity-research workflow. They are documented in `SEO-GEO-PROJECT-BRIEF.md` and must not be silently replaced or invented.

## Publication rule

Any new page containing a changing institutional rule, admissions conversion, NEM/PAES table, university-specific algorithm, fee, deadline, or procedural requirement must be added to this registry before it is made indexable.
