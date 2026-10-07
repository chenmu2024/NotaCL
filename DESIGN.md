# NotaCL Design System

## 1. Product and visual positioning

- Product: Chile-focused grade calculators and grading-scale tools.
- Audience: secondary/university students, teachers and parents in Chile.
- Primary task: get a correct grade result immediately, then understand or reuse the calculation.
- Brand personality: calm, precise, useful, trustworthy, local without patriotic decoration.
- Desired perception: a dependable everyday education utility, not an AI SaaS landing page.
- Design direction: light, compact productivity UI with strong result hierarchy.
- References: Cal.com (functional restraint), Wise (clarity and trust), Notion (calm reading surfaces), Airtable (structured table legibility). Learn principles only; do not clone brand identity.

## 2. Visual theme

White/light-neutral canvas, low decoration, dense-but-readable tool panels, generous whitespace around headings/results, no stock hero imagery. Inputs and results are visually dominant. Tables remain readable on mobile through horizontal scrolling.

## 3. Color system

| Token | Value | Role |
|---|---|---|
| canvas | #f6f8fc | Page background |
| surface-1 | #ffffff | Cards/tool panels |
| surface-2 | #eef3ff | Secondary info surface |
| ink | #172033 | Primary text |
| body | #344054 | Body copy |
| muted | #667085 | Secondary copy |
| hairline | #d8dee9 | Borders/dividers |
| primary | #3157d5 | Primary action |
| primary-hover | #2748b8 | Hover |
| on-primary | #ffffff | On primary |
| success | #197a50 | Valid/pass state |
| warning | #9a6700 | Warning |
| error | #b42318 | Invalid/fail state |
| focus | #84a7ff | Focus ring |

No decorative gradients. Accent is reserved for actions, selected states and key numeric results.

## 4. Typography

System stack only for speed: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Token | Size | Weight | Line-height | Use |
|---|---:|---:|---:|---|
| display-xl | clamp(2rem, 5vw, 3.5rem) | 750 | 1.05 | H1 |
| display-lg | clamp(1.6rem, 3vw, 2.3rem) | 720 | 1.15 | Major section |
| heading | 1.35rem | 700 | 1.25 | Card/section H2 |
| subheading | 1.05rem | 700 | 1.35 | H3 |
| body-lg | 1.1rem | 450 | 1.65 | Intro |
| body | 1rem | 400 | 1.65 | Default |
| body-sm | .9rem | 400 | 1.55 | Secondary |
| caption | .8rem | 550 | 1.4 | Labels/meta |

## 5. Spacing

Base 4px. Tokens: 4, 8, 12, 16, 24, 32, 48, 72px. Tool cards use 20–28px padding desktop, 16–20px mobile. Main sections use 56–80px vertical space.

## 6. Grid & layout

- Max content width: 1160px
- Reading width: 760px
- Tool workspace: 960px
- Desktop gutters: 24px
- Mobile gutters: 16px
- Tool pages: intro + main tool, then explanatory reading sections
- Avoid sidebars on mobile; desktop may use 2-column form/result layouts only when result stays visible without crowding.

## 7. Shape

Inputs 10px, cards 16px, major tool shell 20px. Pills only for statuses/tags. No exaggerated 32px+ cards.

## 8. Elevation

Use borders and surface contrast first. One subtle shadow is allowed for the primary calculator shell only: `0 12px 32px rgba(23,32,51,.08)`.

## 9. Components

Buttons: 44px minimum height, clear primary/secondary hierarchy, visible focus. Inputs: persistent labels, helper/error text below, comma and dot examples where relevant. Result panels: large numeric value, short label, status/assumption nearby. Tables: sticky header optional, zebra-free by default, borders for scanability. Alerts: semantic icon + text, never color alone.

## 10. Imagery & icons

No irrelevant stock images. Use small inline SVG icons only where they improve scanability. Original diagrams are optional for explanatory guides; tools and tables are the primary visual assets.

## 11. Motion

120–180ms transitions for hover/focus. No entrance animation on primary calculators. Respect `prefers-reduced-motion`.

## 12. Responsive

- Mobile < 640px: single column, 16px gutters, tables scroll, nav collapses.
- Tablet 640–959px: single/2-column where safe.
- Desktop 960–1279px: 2-column tool panels allowed.
- Wide ≥1280px: content remains capped; no stretched forms.

## 13. Accessibility

WCAG AA contrast target, 44px touch target, visible 3px focus ring, semantic labels/fieldset where needed, keyboard operability, live result regions with `aria-live="polite"`, semantic landmarks/headings.

## 14. Do / Don't

Do: put the calculator above long explanatory content; keep assumptions visible; make output easy to copy/print; favor legible tables.

Don't: giant Chile flag, AI gradients/glow/glassmorphism, marketing hero art, arbitrary token values, hidden labels, decorative chart junk, modal gating or account prompts.
