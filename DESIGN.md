# NotaCL Design System

## 1. Product and visual positioning

- Product: Chile-focused grade calculators and grading-scale tools.
- Audience: secondary/university students, teachers and parents in Chile.
- Primary task: obtain a trustworthy result in seconds, then understand, save, print or continue the calculation.
- Brand personality: clear, capable, youthful without being childish, local without flag decoration.
- Desired perception: the dependable calculator students bookmark and teachers are comfortable sharing.
- Design direction: **editorial utility** — a strong product interface first, with calm content bands around it.
- References studied through `VoltAgent/awesome-design-md`:
  - **Wise**: the interactive utility is the hero; soft canvas + high-contrast white tool surface + strong result hierarchy.
  - **Airtable**: editorial whitespace, restrained shadows, color-block sections used as punctuation rather than decoration.
  - **Cal.com**: task-first navigation and compact controls.
  - **Notion**: readable explanatory content and quiet surfaces.
- What must NOT be copied: proprietary typefaces, logos, exact palettes, signature layouts or brand-specific geometry.

## 2. Visual theme & atmosphere

NotaCL should not look like a generic template made of tiny bordered cards. The page uses a warm-white/ice canvas, large dark-ink typography and one cobalt action color. The calculator is the most visually important object on the page. Result panels use a dark navy polarity flip so the numeric answer is unmistakable. Supporting content alternates between white, soft-blue and dark-ink bands to create rhythm.

Decoration is intentionally low. Brand character comes from typography, surface contrast, asymmetric/bento tool cards and a small square “N” mark — not gradients, illustrations or stock photos.

## 3. Color system

| Token | Value | Role |
|---|---|---|
| canvas | #f4f7fb | Global background |
| surface-1 | #ffffff | Primary cards/tool panels |
| surface-2 | #edf3ff | Blue-tinted secondary surface |
| surface-3 | #eef1f5 | Neutral secondary surface |
| ink | #0d1b36 | Headings / dark result surfaces |
| ink-soft | #14294d | Secondary dark surface |
| body | #34435d | Body copy |
| muted | #6b7890 | Secondary text |
| hairline | #d8e0eb | Borders/dividers |
| primary | #2257d6 | Primary action / brand accent |
| primary-hover | #1746b7 | Hover |
| primary-soft | #dfe9ff | Soft brand surface |
| on-primary | #ffffff | Text/icons on primary |
| success | #137a55 | Pass state |
| success-soft | #dff6eb | Pass-state surface |
| warning | #8a5a00 | Warning |
| warning-soft | #fff3d6 | Warning surface |
| error | #b42318 | Invalid/fail state |
| error-soft | #ffebe9 | Error surface |
| focus | #7ea2ff | Focus ring |

Rules:
- Cobalt is reserved for actions, selected states, links and a small number of brand cues.
- Dark navy is used for the result card and footer, not as a generic background everywhere.
- Warm yellow is semantic/caution only.
- No decorative gradients, mesh backgrounds, glows or glassmorphism.
- No dark mode in the first release; this product benefits more from consistent printable light surfaces.

## 4. Typography

System stack for performance: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Token | Size | Weight | Line-height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| display-xl | clamp(2.7rem, 6vw, 4.65rem) | 800 | .98 | -.055em | Home H1 |
| display-lg | clamp(2rem, 4vw, 3.15rem) | 780 | 1.04 | -.045em | Tool-page H1 / major section |
| heading | clamp(1.55rem, 2.5vw, 2.15rem) | 760 | 1.15 | -.03em | Section heading |
| subheading | 1.15rem | 720 | 1.35 | -.015em | Card/tool heading |
| body-lg | 1.125rem | 430 | 1.65 | 0 | Lead text |
| body | 1rem | 420 | 1.65 | 0 | Default |
| body-sm | .9rem | 430 | 1.55 | 0 | Secondary |
| caption | .76rem | 700 | 1.4 | .075em | Eyebrows/meta |

Principles:
- Hierarchy comes from scale and spacing before weight.
- Never shrink important tool copy to “dashboard microtext”.
- Numeric results may be 4.5–6rem with tight tracking.

## 5. Spacing system

Base unit: 4px.

| Token | Value |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |
| section | 88px |

- Major homepage bands: 72–96px desktop, 48–64px mobile.
- Tool shell padding: 28–36px desktop, 20px mobile.
- Card padding: 24–30px.
- Form field gaps: 16–18px.
- Avoid giant empty gaps with no hierarchy.

## 6. Grid & layout

- Max content width: 1180px.
- Reading width: 760px.
- Tool workspace: 1080px.
- Desktop gutters: 28px.
- Mobile gutters: 16px.
- Home hero: 7/5 split copy + useful orientation card; stacks on mobile.
- Main calculator: 55/45 split form + result at desktop; result becomes first-class full-width block on mobile.
- Tool discovery: asymmetric 12-column bento grid, not five identical tiny cards.
- Content: 2-column editorial explanation + formula/assumption card where useful.
- Footer: three columns desktop, single column mobile.

## 7. Shape system

| Token | Radius | Use |
|---|---:|---|
| sm | 10px | Inputs/compact controls |
| md | 14px | Secondary cards |
| lg | 20px | Tool cards |
| xl | 26px | Main calculator/result surfaces |
| full | 9999px | Status/badges only |

Rounded geometry should feel deliberate and modern, not excessively pill-shaped.

## 8. Elevation & depth

Use surface contrast first.
- Header: 1px bottom hairline, no shadow.
- Main calculator: one soft shadow `0 24px 70px rgba(13,27,54,.10)`.
- Cards: no default shadow; hover may use `0 14px 30px rgba(13,27,54,.08)`.
- Result card: no shadow; dark/light polarity provides depth.
- Never stack multiple shadow levels on the same component.

## 9. Components

### Header
White sticky bar, 72px high. Brand uses square mark + wordmark. Desktop nav remains quiet; one compact primary CTA may appear. Mobile keeps brand + CTA, not an empty bar after hiding navigation.

### Buttons
48px minimum height on primary flows. Primary cobalt fill; secondary white with strong hairline. Hover changes fill/border, not scale. Focus uses a visible 3px focus ring.

### Inputs
48–52px tall, persistent label, white surface, darker border than surrounding hairlines. Focus uses cobalt border + soft focus ring. Error uses both color and copy.

### Calculator shell
Large white surface. Header is part of the same component. Desktop uses split panels. It should look like a product, not a form pasted into a blog.

### Result panel
Dark navy card with white copy, oversized number, pale-blue meta text and green/red semantic pill. Result must be the highest contrast element after H1.

### Tool cards
Bento layout with icon/symbol tile, eyebrow, title, description and arrow. One featured card may use dark navy or cobalt-soft surface. Avoid five identical bordered rectangles.

### Tables
White, strong header hierarchy, no zebra striping by default, horizontal scroll on mobile.

### Alerts
Soft semantic surface, compact icon/label when useful. Avoid large beige blocks that dominate the calculator.

### Footer
Dark navy full-bleed band with light text. Brand, tool links and legal links remain legible and compact.

## 10. Imagery & iconography

- No irrelevant stock imagery.
- Icons are simple inline SVG or typographic symbols, 20–24px, 1.75–2px stroke.
- Tool cards may use mathematical symbols as brand-native utility iconography.
- No flag illustration as decoration.
- No third-party icon font dependency.

## 11. Motion

- Default transition: 150ms.
- Easing: ease-out.
- Allowed: color, border, subtle translateY(-1px) on card hover.
- Prohibited: entrance animation on the primary calculator, bouncing numbers, parallax, glow pulses.
- Respect `prefers-reduced-motion`.

## 12. Responsive behavior

| Breakpoint | Width | Behavior |
|---|---:|---|
| Mobile | <640px | Single column, 16px gutters, nav links hidden but CTA remains, result card full-width |
| Tablet | 640–959px | Hero stacks, bento becomes 2 columns, calculator may stack |
| Desktop | 960–1279px | Split hero/calculator, 12-column bento |
| Wide | ≥1280px | Content capped at 1180px |

Touch targets are at least 44px. Tables scroll intentionally. No horizontal page overflow.

## 13. Accessibility

- WCAG AA minimum contrast.
- 44px minimum target; 48px preferred for primary controls.
- 3px visible focus ring.
- Calculator results use `aria-live="polite"`.
- Labels remain visible; placeholders never replace them.
- Status never depends on color alone.
- Semantic landmarks/headings are mandatory.

## 14. Do / Don't

### Do
- Make the answer visually dominant.
- Let the calculator occupy meaningful width.
- Use full-width section bands to create page rhythm.
- Use a dark result card and dark footer as recognizable NotaCL signatures.
- Use asymmetric tool cards to avoid generic-template smell.
- Keep explanatory content readable and secondary to the tool.

### Don't
- Do not return to tiny 12–14px interface text for primary controls.
- Do not render every section as the same white bordered card.
- Do not use giant Chile flags, decorative gradients, glassmorphism or AI-SaaS glow.
- Do not use unnecessary illustrations where product UI is the useful visual.
- Do not sacrifice task clarity for visual novelty.

## 15. AI implementation guide

Before changing UI:
1. Read this file.
2. Reuse these tokens/components.
3. If the visual language changes, update this file first.
4. Validate 360px, 768px and 1280px widths.
5. Compare the result against the product task: the tool and its numeric result must win the visual hierarchy.
