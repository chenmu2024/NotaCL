# NotaCL Design System

## 1. Product and visual positioning

- Product: Chile-focused grade calculators and grading-scale tools.
- Audience: secondary/university students, teachers and parents in Chile.
- Primary task: get a trustworthy answer in seconds, then understand, save, print or continue the calculation.
- Brand personality: sharp, useful, contemporary, student-friendly, never childish.
- Desired perception: the calculator students bookmark because it is clearer and faster than school spreadsheets.
- Design direction: **bold editorial utility**. The homepage should feel like a real product, not a pale SEO template.
- References studied through `VoltAgent/awesome-design-md`:
  - Wise: put the useful calculator inside the hero and make the product itself the visual.
  - Airtable: use large surface changes and editorial whitespace instead of many identical bordered cards.
  - Cal.com: task-first controls and restrained navigation.
  - Notion: calm explanatory copy and readable information hierarchy.
- Do not copy proprietary fonts, exact palettes, logos or signature components from any reference.

## 2. Visual theme & atmosphere

The homepage uses a **deep ink hero**, an **off-white editorial body**, and a **warm signal accent**. The main calculator is embedded in the hero rather than sitting below it as a separate white box. This creates an immediate, unmistakable visual change from a generic utility template.

The rest of the site alternates between warm off-white, pure white and ink sections. Cards are large and typographic, not tiny bordered tiles. The result is the strongest visual object in every calculator.

## 3. Color system

| Token | Value | Role |
|---|---|---|
| canvas | #f7f4ee | Warm site background |
| surface-1 | #ffffff | Calculator/card surface |
| surface-2 | #eef2f7 | Cool secondary surface |
| ink | #0b1736 | Hero/result/footer |
| ink-soft | #16264a | Secondary dark surface |
| body | #39445a | Body copy |
| muted | #5f6b7a | Secondary text with AA-safe contrast on light surfaces |
| line | #d8e0eb | Borders/dividers |
| line-strong | #bcc8d8 | Strong input/table borders |
| primary | #ff7a45 | Primary action / warm signal |
| primary-hover | #e76534 | Primary hover |
| primary-soft | #fff0e8 | Soft warm surface |
| link | #8d351b | Text links on light surfaces |
| cool-accent | #9ec5ff | Secondary informational accent |
| success | #137a55 | Pass state |
| success-soft | #dff6eb | Pass surface |
| warning | #8a5a00 | Warning |
| warning-soft | #fff3d6 | Warning surface |
| error | #b42318 | Error/fail |
| error-soft | #ffebe9 | Error surface |
| focus | #9ec5ff | Focus ring |

Rules:
- Orange is the only conversion/action accent.
- Blue is informational only.
- Ink carries hero/result/footer contrast.
- No gradients, glow, glassmorphism or decorative background blobs.
- Color-block sections may be full bleed.

## 4. Typography

System stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Token | Size | Weight | Line-height | Use |
|---|---:|---:|---:|---|
| display-xl | clamp(3rem, 7vw, 5.8rem) | 800 | .94 | Home H1 |
| display-lg | clamp(2.25rem, 5vw, 4rem) | 780 | 1.0 | Tool-page H1 |
| heading | clamp(1.8rem, 3vw, 2.7rem) | 760 | 1.08 | Section heading |
| subheading | 1.2rem | 720 | 1.3 | Card/tool heading |
| body-lg | 1.15rem | 430 | 1.65 | Lead |
| body | 1rem | 420 | 1.65 | Default |
| body-sm | .9rem | 430 | 1.55 | Secondary |
| caption | .76rem | 750 | 1.4 | Eyebrows/meta |

Use size, contrast and whitespace before adding heavier weight.

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
| section | 96px |

- Home hero: 88–112px vertical desktop.
- Calculator interior: 28–36px.
- Editorial section bands: 80–100px.
- Mobile reductions: 48–64px.

## 6. Grid & layout

- Max content width: 1180px.
- Reading width: 760px.
- Desktop gutters: 28px.
- Mobile gutters: 16px.
- Homepage hero: 5/7 split — large editorial copy left, embedded calculator right.
- Calculator: compact 3-input stack + oversized result block.
- Tool discovery: asymmetric 12-column layout with one full-width/feature card.
- Explanation section: 2-column editorial text + compact methodology block.
- Footer: dark, full bleed, three columns.
- Tool pages remain task-first but inherit the stronger palette, larger typography and result treatment.

## 7. Shape system

| Token | Radius | Use |
|---|---:|---|
| sm | 10px | Inputs |
| md | 14px | Compact cards |
| lg | 20px | Tool cards |
| xl | 28px | Main calculator |
| full | 9999px | Pills/status only |

## 8. Elevation & depth

- Hero calculator: one strong but soft shadow, `0 28px 80px rgba(0,0,0,.22)`.
- Supporting cards: border first, no shadow by default.
- Hover cards: subtle shadow only.
- Result panel: dark surface contrast, no shadow.
- Do not layer shadows on every card.

## 9. Components

### Header
Homepage header visually merges with the ink hero. Tool/content pages use warm-light header. Logo uses square N mark + wordmark. Desktop nav is compact; tablet/mobile uses a native `details` menu. The primary CTA remains visible on medium mobile widths and hides below 560px to protect the header from crowding.

### Hero
Full-bleed ink background. H1 is large and left-aligned. Supporting copy is restrained. The calculator is visible above the fold and is the main visual.

### Primary button
Orange fill with ink text for reliable contrast, 48px minimum height, 10–12px radius. Hover darkens orange, never scales dramatically. Disabled actions use reduced opacity, no lift/transform and a not-allowed cursor.

### Inputs
50–52px tall, white, high-contrast border, explicit label, strong focus state. Read-only values use a quieter neutral surface; disabled controls reduce opacity and remain visibly non-interactive.

### Result
Ink or orange polarity-flipped block with oversized numeric value and compact status/meta.

### Tool cards
Large typographic surfaces with numbers/symbols. Avoid five small equal white cards. Use one dominant feature card plus supporting cards.

### Tables
White, crisp headers, no decorative striping by default, horizontal scroll on mobile.

### Alerts
Compact semantic blocks, not large beige paragraphs.

### Footer
Ink full-bleed surface, light type, clear grouping.

## 10. Imagery & iconography

- No stock hero imagery.
- Use simple inline SVG or mathematical symbols.
- Product UI is the visual asset.
- No Chile flag decoration.
- No icon-font dependency.

## 11. Motion

- 140–180ms ease-out.
- Allowed: border, color, subtle 1–2px movement.
- No hero entrance animation, bouncing numbers, parallax or glow pulses.
- Respect reduced motion.

## 12. Responsive behavior

| Breakpoint | Width | Behavior |
|---|---:|---|
| Mobile | <640px | Hero and calculator stack, calculator immediately after copy, single-column tool cards |
| Tablet | 640–959px | Hero stacks, 2-column supporting cards |
| Desktop | 960–1279px | Full split hero and embedded calculator |
| Wide | ≥1280px | Capped 1200px content |

Primary touch targets 48px where practical.

## 13. Accessibility

- WCAG AA contrast for normal text and controls.
- Visible 3px focus ring with offset.
- Labels are always visible; placeholders never replace labels.
- Results and validation/share feedback use `aria-live="polite"` where state changes dynamically.
- Status includes text, not color alone.
- Buttons and primary controls are at least 44px high globally and 48px where practical.
- Disabled/read-only states must remain distinguishable without relying on color alone.
- Local calculator operations are synchronous, so no fake loading state is introduced; if an asynchronous feature is added later it must expose a text loading state.
- Semantic landmarks/headings and table captions are required where they improve navigation.
- Reduced-motion mode removes nonessential transitions.

## 14. Do / Don't

### Do
- Make the homepage visibly different within one second.
- Put the calculator in the hero.
- Use deep full-width surfaces, not only pale backgrounds.
- Use warm orange as the unmistakable action color.
- Let the result dominate the interface.
- Keep core SEO keywords intact in H1/title.

### Don't
- Do not revert to a pale blue/white template.
- Do not make every section a bordered card.
- Do not use tiny interface text.
- Do not add gradients, glow, glass or decorative blobs.
- Do not hide the useful tool below marketing copy.

## 15. AI implementation guide

Before UI changes:
1. Read this file.
2. Preserve approved SEO intent/H1 ownership.
3. Reuse these tokens and component rules.
4. Validate 360px, 768px and 1280px.
5. The first-screen calculator and result must be the visual priority.
