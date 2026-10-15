# V2 design and implementation requirements

Maintain the existing GitHub Pages site and the chapter's visual identity.
Build the V2 homepage from scoped parts and run `python3 v2/build.py` after edits.

## Design and copy

- Use purple, cream, gold, Instrument Serif at weight 400, and Inter for text.
- Reuse `tokens.css` for colors, spacing, typography, widths, and easing.
- Use gold ink on light surfaces and soft gold on dark surfaces for small text.
- Keep headings short and factual. Membership has no overall visible heading.
- Preserve Member Success, Chapter Life, and Rush Phi Chi Theta as section names.
- Use actual employer logos and real chapter photographs. Record new asset sources.
- Use one clear primary action at each decision point and comfortably sized buttons.
- Do not invent statistics, event dates, deadlines, countdowns, or recognition claims.
- Use motion only where it serves the page. Static layouts are appropriate.

## Responsive behavior

- No horizontal page overflow, clipped headings, pinned scrolling, or scroll hijacking.
- At phone widths, use readable text, consistent gutters, compact section spacing,
  a one-row header, an accessible disclosure menu, and a compact Rush section.
- Logos remain still and legible; the gallery keeps all real photos available.
- Review the whole page visually on phones, tablets, and desktops after integration.

## Engineering and accessibility

1. Base HTML and CSS must show complete content and working links without JavaScript.
   Scripts progressively enhance membership controls, numbers, header state, and hero.
2. Respect `prefers-reduced-motion`, including changes during the session. Register
   teardown work with `window.pctMotion.onReduce` when appropriate.
3. Animate transforms and opacity; avoid expensive layout work inside animation loops.
4. Give images accurate dimensions and alternative text; lazy-load below-fold images.
5. Keep controls keyboard reachable, touch targets at least 44px, and focus rings visible
   against their actual background. Expanded controls must expose the correct state.
6. Keep local references and accessible labels valid. The V2 homepage stays in `/v2/`;
   dedicated pages live at the repository root.
7. Keep selectors scoped to their part. Use vanilla HTML, CSS, and JavaScript without
   new runtime dependencies. Initializers must safely tolerate missing markup.
8. The lead owns integration and generated output. Delegate ownership of specific parts
   explicitly; do not overwrite another contributor's work.
