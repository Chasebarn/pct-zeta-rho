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
| Membership | No intro heading; three rows with matching photos |
| Member Success | Twenty actual logos in a static grid; three existing chapter figures |
| National | Original large heading with gold italic 1924, transparent crest and chapter count |
| Chapter Life | Original continuous circular photo carousel, authentic photos and native pause control |
| Rush | Display heading, gold italic fraternity name, plain Rush button, support band |
| Footer | Chapter identity, page links and social links |

Content is visible without JavaScript. Motion respects reduced-motion preferences;
the original photo carousel has a pause control and a still reduced-motion state.
There is no pinned scrolling, logo marquee, or mock countdown.
The company logo provenance is recorded in `assets/logos/sources.json`.

## Preview and verification

Serve the repository locally and open `/v2/index.html`. Check small phones through
wide desktop widths, keyboard navigation, the membership controls, mobile menu,
local image loading, reduced motion, and the page without JavaScript. Rebuild
before deployment and verify the generated page and actual hosted assets.
