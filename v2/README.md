# PCT homepage V2

Live: https://chasebarn.github.io/pct-zeta-rho/v2/index.html

V2 is a separate homepage. The root homepage and dedicated pages are preserved.
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
| Header | One row; native mobile disclosure; opaque safe base |
| Hero | Original full-height left-aligned composition, one value line, plain Rush button, silk canvas |
| Membership | Two-line editorial titles, full-height photo stage with mask transitions; phone photo stays inside its category |
| Member Success | Left-aligned display heading, three animated outcomes, compact logo rows; expandable marks on phones |
| National | Original heading; coastline entrance and 50 sourced campus pins, USF highlight and university selector |
| Chapter Life | Original circular photo carousel, authentic photos; no visible pause button |
| Rush | Display heading, gold italic fraternity name, plain Rush button, dark support band continuous with footer |
| Footer | Chapter identity, page links and social links |

Content is visible without JavaScript. Motion respects reduced-motion preferences;
the original photo carousel pauses on hover/focus and has a still reduced-motion state.
Titles reveal through word masks while preserving italic accents and accessible names.
Figures count once without changing column widths, and selecting a campus settles its pin.
Focused controls immediately settle any entrance animation so they stay visible.
Button highlights and footer underlines respond to hover and keyboard focus.
There is no pinned scrolling, logo marquee, or mock countdown.
The company logo provenance is recorded in `assets/logos/sources.json`.
Chapter locations, federal NCES coordinates, and Census-derived geography are
recorded in `assets/map/`. The standard-library-only `chapter_map.py` renders
the map and selector into national-section markers during the ordinary build;
no external map scripts, runtime requests, or new dependencies are needed.

## Preview and verification

Serve the repository locally and open `/v2/index.html`. Check small phones through
wide desktop widths, keyboard navigation, the membership controls, mobile menu,
local image loading, reduced motion, and the page without JavaScript. Rebuild
before deployment and verify the generated page and actual hosted assets.
