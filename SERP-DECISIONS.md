# NotaCL SERP Architecture Decisions

Checked: 2026-10-07  
Market: Chile / Spanish  
Purpose: document the search-result evidence used to decide whether similar keywords deserve separate canonical pages. These are project architecture decisions, not Google ranking rules.

## Verification limitation — 2026-10-08

The snapshots below are representative result/page-type observations. They do not establish the supplied plan's exact Google Chile Top10 overlap thresholds for all seven query pairs. The full gate remains pending; in particular, the specialized 60% route's final indexation decision is not certified by this document.

A fresh direct Google request used `gl=cl`, `hl=es`, `pws=0`, `num=10` for `escala de notas` on 2026-10-08. The web reader could not access the search URL; the browser reader timed out; a second content reader reached Google's unusual-traffic/reCAPTCHA page. No ranked result list was obtained and no overlap count was inferred. Do not retry by treating generic web-search results as a Google Top10 export.

To close the gate, retain the top ten organic destination URLs in rank order, timestamp, query, Chile/Spanish settings, and page type for each query below, then compare all plan pairs:

- calculadora de notas
- promedio de notas
- generador de notas
- escala de notas
- tabla de notas
- puntaje a nota
- escala de notas al 60

Exclude advertisements and secondary sitelinks from the ten organic entries. Compare exact destination-page overlap separately from domain overlap and inspect the dominant task/page types. Apply the plan's ≥6 / 4–5 / ≤3 thresholds only to a complete reproducible set.

## Decision summary

| Intent pair | Observed result pattern | Decision |
|---|---|---|
| `escala de notas` vs `escala de notas al 60` | Generic query returns broad configurable calculators/guides; 60% query returns multiple dedicated 60%-specific tables/tools and institutional 60% documents | Keep generic `/escala-de-notas/` and ship specialized `/escala-de-notas/60/` |
| `escala de notas` vs `tabla de notas` | “tabla de notas” results substantially overlap broad scale/generator content, including pages whose main product is the same score→grade table | Keep table inside `/escala-de-notas/`; do not ship `/tabla-de-notas/` |
| `escala de notas` vs `puntaje a nota` | “puntaje a nota” results are dominated by pages explicitly titled/positioned as escala de notas / score-to-grade calculators | Keep score→grade conversion in `/escala-de-notas/`; do not ship `/puntaje-a-nota/` |
| `generador de notas` vs generic scale | Search results include dedicated generator pages focused on producing the full table, while generic scale results include quick conversion and explanatory pages | Keep `/generador-de-notas/` separate from `/escala-de-notas/` |
| `calculador/calculadora de notas` vs `promedio de notas` | “Calculador de notas” results include direct puntaje→nota tools and broad multi-tool hubs; “promedio de notas” remains a distinct averaging task | Keep homepage as general hub with fast score→grade calculator; keep `/promedio-de-notas/` as the dedicated average intent |

## Evidence snapshots

### Generic escala de notas

Representative results observed:
- https://calculador.cl/guias/escala-de-notas-chile
- https://calculika.com/cl/escala-de-notas/
- https://calculanotas.cl/
- https://notaclara.cl/

The result set mixes configurable tools and explanatory scale pages.

### Escala de notas al 60

Representative results observed:
- https://calculanotas.cl/escala-notas-60
- https://minota.cl/blog/tabla-de-notas-al-60
- https://escaladenotas.com/escala-de-notas-60-de-exigencia/
- Mineduc-hosted school evaluation PDFs containing explicit 60%-exigency tables/rules

This set has a materially stronger fixed-60% page type, supporting a specialized route with its own fixed configuration, reference table and approval-point examples.

### Tabla de notas

Representative results observed:
- https://minota.cl/blog/escala-de-notas-chile-tabla-completa
- https://calculanotas.cl/
- https://notaclara.cl/guias/crear-tabla-de-notas-para-docentes/
- https://calculanotas.cl/generador-de-notas

The query does not show enough separation from escala/generator tasks to justify another canonical tool page at launch.

### Puntaje a nota

Representative results observed:
- https://calculika.com/cl/escala-de-notas/
- https://calculador.cl/escala-de-notas
- https://notaexacta.com/

These pages satisfy puntaje→nota inside their escala de notas product, so NotaCL keeps that conversion consolidated.

## Recheck rule

Re-run the comparison when:
1. Search Console shows a candidate query with meaningful impressions but poor ranking/CTR on the current canonical page.
2. A dedicated competitor page consistently occupies the result set for a candidate intent.
3. The owner provides newer Semrush/SERP exports that materially change the evidence.

Do not create a new indexable route merely because a synonym has measurable volume.


### Calculador / calculadora de notas vs promedio

Representative results observed for the broad calculator intent:
- https://calculanotas.cl/calculador-de-notas — direct score/total/exigency → grade calculator
- https://www.edu21.cl/herramientas/calculadora-notas — broad student calculator combining averages, required grades and score→grade
- https://tgb.cl/notas/ — broad calculator covering average, exam target and score conversion

This supports a broad homepage/hub while preserving `/promedio-de-notas/` for the specific arithmetic-average task rather than making the homepage duplicate the full average calculator.
