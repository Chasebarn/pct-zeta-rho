# V2 design and implementation requirements

Maintain the GitHub Pages site and the chapter's visual identity. Edit scoped
parts and run `python3 v2/build.py`; commit source and generated output together.
Root V1 and legacy resource pages remain separate.

## Design and copy

- Use purple, cream, gold, Instrument Serif at weight 400, and Inter for text.
- Reuse tokens for colors, spacing, typography, widths, and easing. Use gold ink
  on cream and soft gold on dark surfaces for small text.
- Preserve the original left-reading hero, its large static identity, and its
  italic university line. No word clipping masks or entrance effect on hero text.
- Give the hero context bar enough contrast and size to read. Primary Rush labels
  are 18px; button proportions must be balanced with their type.
- Membership has no overall visible heading. Keep complete category titles and
  supporting real photography, with larger type and generous selection targets.
- Membership and Member Success share cream, separated by an inset rule.
  National and closing Rush share deep purple, separated by an inset rule.
- Member Success remains large and prominent. Gold figures count once on entry
  from 1 to 95%, 1 to 3.60, and 1 to 15. Keep accessible final values and stable widths.
- All twenty actual logos appear in two desktop / three phone rows. Alternate
  row directions and follow normal page scrolling at a measured, readable pace.
  Fade before the hard edge, pad endpoints, and expose every mark. No manual
  sideways control, clock-driven marquee, scroll pinning, or oversized empty stage.
- Preserve the national headline with italic gold 1924. Pair benefit-led copy with
  a larger map. Bold the verified collegiate-chapter count within the copy.
  No redundant map caption, crest, About action, directory link, or campus picker.
- Map only sourced national collegiate campuses. Pop dots once across the country
  on entry, animating dot/ring children without moving geographic group transforms.
- Exclude Chapter Life from the published homepage; retain its source for recovery.
- Center all closing invitation content at every width. Use one restrained arrival
  glow on Rush PCT, with a static reduced-motion treatment.
- Keep CTA labels plain, without decorative arrows. Header crest remains transparent.
- Do not invent statistics, dates, deadlines, countdowns, or recognition claims.
  Preserve the existing chapter figures with their verification limitation in COPY.md.

## Responsive behavior

- No horizontal page overflow, clipped headings, scroll hijacking, or hidden logos.
- Membership remains two columns from 760px, with copy left and photo right. Phone
  category changes retain the selected control's screen position.
- Use consistent gutters, readable text, a one-row mobile header, accessible mobile
  navigation, and a centered display-led Rush section.
- Review the whole page on small phones, tablets, narrow desktops, and wide desktops.

## Engineering and accessibility

1. Base HTML/CSS show complete content and working links without JavaScript. Reduced
   motion and no JavaScript expose every company in a static wrapping layout.
2. Respect reduced-motion preferences, including live changes, through pctMotion.
3. Animate transforms and opacity for graphic motion. Count-up text updates run only
   for their short entry interval. No generic rising blocks or text splitting masks.
4. Images have dimensions, descriptive alternative text, and lazy loading below fold.
5. Controls are keyboard reachable with 44px touch targets and visible focus rings.
   Disclosure state must match expanded content.
6. Keep local references, IDs, labels, and links valid. V2 homepage and Rush remain
   in /v2/; retained legacy resource pages live at the repository root.
7. Scope selectors to parts. Use vanilla HTML/CSS/JS without runtime dependencies.
   Initializers safely tolerate absent markup and repeated calls.
8. The lead owns integration and generated output. Delegate specific source parts
   explicitly and do not overwrite another contributor's work.
