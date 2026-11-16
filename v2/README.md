# PCT homepage V2

Live: https://chasebarn.github.io/pct-zeta-rho/v2/index.html

V2 has an independent homepage and a matching Rush page. The root homepage and
legacy dedicated pages remain unchanged.

## Editing and building

Edit `parts/NN-name.html`, `.css`, and optional `.js`, then run from the repository root:

    python3 v2/build.py

The builder assembles `v2/index.html`, renders the sourced SVG chapter map, rewrites
asset and dedicated-page links, and generates the shared header and footer
stylesheet for `v2/rush.html`. Commit changed source and generated files together.
V2 does not load the legacy stylesheet. Design tokens and local font declarations
are in `tokens.css`; font binaries and SIL Open Font Licenses are in `assets/fonts/`.

## Page structure

| Section | Treatment |
|---|---|
| Header | National crest, chapter wordmark, one navigation disclosure on phones |
| Hero | Left-aligned identity and action with real chapter photography; no entrance or background animation |
| Membership | Three topic controls and a shared photo; no focus-triggered selection or programmatic scrolling |
| Member Success | Shared cream field with inset rule; gold count ups; two desktop / three phone company rows |
| National | 46 verified collegiate pins; fixed campus marks and one quiet USF ring emphasis |
| Chapter photos | Six originals in a user-controlled circular arc, no visible heading |
| Rush | Full-width purple section overlaps the cream photo arc; centered action |
| Footer | Wordmark and chapter resources |

The carousel has previous/next buttons, arrow-key navigation and a horizontal
touch gesture. It never moves on a timer. Without JavaScript, the six photos
appear in a static grid. Reduced motion removes animated transitions and presents
all employer marks without scroll-linked travel. The map is always visible.

See `COPY.md` for copy and sourced claims, `CONTRACT.md` for engineering notes,
and `AUDIT.md` for the November review and remaining recruitment dependency.
