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
| Header | Chapter-focused navigation; native mobile disclosure; legible gold Rush action |
| Hero | Larger static identity in the original left-reading composition; stronger context bar; silk canvas |
| Membership | Larger complete category titles at left, supporting photo at right; phone photo inside its category |
| Member Success | Same cream field, inset divider, gold figures that count once on entry; two desktop / three phone logo rows |
| National | Large headline and benefit-led copy beside a larger U.S. map; campus dots appear across the country on entry |
| Rush | Centered invitation and action, with one soft arrival glow; continuous purple field with an inset divider |
| Footer | Chapter identity, page links and social links |

The Chapter Life section is excluded from the build at the user's request; its source
and photographs remain available for recovery. Primary navigation now links to the
National Network instead. Hero text is static and has no word clipping masks.

Content is visible without JavaScript. Motion respects reduced-motion preferences,
including changes during a session. Count-up figures have stable final accessible
names. Pin animation leaves geographic placement intact. The company rows follow
normal page scrolling in opposite directions with compact optical sizing, slower
travel and earlier soft edges. There is no clock-driven logo marquee, pinned
scrolling, manual sideways control, or mock countdown.

Membership stays in two columns from 760px; phone category changes retain the
selected control's screen position. Reduced motion and no JavaScript expose every
logo in a static wrapping layout. Logo provenance is in `assets/logos/sources.json`.
National facts and sources are documented in `COPY.md`. Chapter locations, federal
NCES coordinates, and Census-derived geography are recorded in `assets/map/`.
The standard-library-only `chapter_map.py` renders the map during the build;
no external map scripts or runtime dependencies are needed.

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
