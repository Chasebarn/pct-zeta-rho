# PCT homepage V2

Live: https://chasebarn.github.io/pct-zeta-rho/v2/index.html

V2 is a separate homepage. The root homepage and legacy dedicated pages are preserved. V2 has its own
`rush.html` destination with shared generated `site-frame.css`.
It uses the chapter's purple, cream, and gold palette, Instrument Serif and Inter,
real chapter photography, and local employer logo assets.

## Editing and building

Edit `parts/NN-name.html`, `.css`, and optional `.js`, then run from the repo root:

    python3 v2/build.py

The builder assembles `v2/index.html`, rewrites asset and dedicated-page links,
and loads the shared reduced-motion lifecycle before initializing sections.
Commit the source parts and generated homepage together. Shared V2 design tokens
are in `tokens.css`. Copy and factual sourcing notes are in `COPY.md`; engineering
and visual requirements are in `CONTRACT.md`.

## Page structure

| Section | Treatment |
|---|---|
| Header | Chapter-focused navigation; native mobile disclosure; plain gold Rush action |
| Hero | Original full-height left-aligned composition, one value line, plain Rush button, silk canvas |
| Membership | Compact full-phrase titles on the left, supporting photo on the right; phone photo stays inside its category |
| Member Success | Separate paper-deep band; phone outcome ledger; two desktop / three phone full-width logo rows |
| National | Full-width original statement above concise factual copy and a secondary campus map |
| Chapter Life | Original circular photo carousel with six authentic photos; no visible pause button |
| Rush | Display heading paired with a plain action; links to the matching V2 recruitment page |
| Footer | Chapter identity, page links and social links |

Content is visible without JavaScript. Motion respects reduced-motion preferences;
the original photo carousel pauses on hover/focus and has a still reduced-motion state.
Only the hero identity uses a typographic entrance. Figures, national geography,
body copy, and the closing action are readable immediately. Category photos
transition to explain selection; the company rows follow page scrolling; the
original wheel retains its slow circular movement. Buttons use quiet color feedback.
Logo rows have finite endpoints, full-width soft edges, and optical sizing per asset.
Membership stays in two columns from 760px; phone category changes retain the
selected control’s screen position. The carousel radius tapers through tablet widths.
Reduced motion and no JavaScript expose every logo in a static wrapping layout.
There is no pinned scrolling, manual sideways logo control, or mock countdown.
The company logo provenance is recorded in `assets/logos/sources.json`.
Chapter locations, federal NCES coordinates, and Census-derived geography are
recorded in `assets/map/`. The standard-library-only `chapter_map.py` renders
the map into national-section markers during the ordinary build;
no external map scripts, runtime requests, or new dependencies are needed.

## Preview and verification

Serve the repository locally and open `/v2/index.html`. Check small phones through
wide desktop widths, keyboard navigation, the membership controls, mobile menu,
local image loading, reduced motion, and the page without JavaScript. Rebuild
before deployment and verify the generated page and actual hosted assets.

Additional real chapter photographs came from the original chapter Google Site.
Their image URLs, dimensions, retrieval date, and hashes are recorded in
`assets/chapter-photo-sources.json`. Preserve their source frames in the assets;
CSS crops those frames outside the visible photograph. The `assets/ph` and
`assets/mem` directories contain placeholder graphics, not usable photography.
