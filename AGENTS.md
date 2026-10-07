# NotaCL Agent Rules

This project follows `chenmu2024/Website-Starter-Standard`.

1. Preserve the approved Chile keyword set and one-intent/one-canonical ownership.
2. Do not create synonym routes for `mi promedio`, `sacar promedio`, `calcular promedio`, typo variants, or parameter combinations.
3. Read `DESIGN.md` before UI changes and reuse its tokens/components.
4. Read `SEO-GEO-PROJECT-BRIEF.md` before route, metadata, schema, indexation, or content changes.
5. Core formulas live in `src/lib/calculators`; UI code must not reimplement business math.
6. Every formula or example must be testable. Do not hand-write arithmetic results that disagree with the calculator engine.
7. Chilean defaults are configurable assumptions, not claims of a nationwide mandatory grading rule.
8. Public SEO copy must be in crawlable static HTML. JavaScript enhances calculation only.
9. No backend/database/account/paid API without explicit owner approval.
10. After SEO-sensitive changes run `npm run test`, `npm run check`, `npm run build`, and `npm run audit`. Before launch also run responsive/visual QA and `npm run audit:production` against the final domain.

11. Read `SOURCE-REGISTRY.md` before adding or changing institutional, admissions, NEM/PAES, university-specific or other time-sensitive factual claims.
12. A changing external claim must have a source, checked date, refresh rule and failure fallback before its page is indexable.

13. Shareable calculator state must remain in URL fragments (`#...`), never in crawlable query-string page variants. Canonical URLs always point to the clean base route.
14. Do not weaken the fail-closed indexing policy: invalid/missing production origin and preview hosts must remain noindex; real production behavior must be checked after deployment.
15. Do not add a new indexable keyword route merely because a synonym has volume. Update `SERP-DECISIONS.md` with evidence before changing intent ownership.
