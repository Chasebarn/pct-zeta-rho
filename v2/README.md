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
| Hero | Chapter identity, one value line, Rush button, subtle canvas |
| Membership | No intro heading; three rows with matching photos |
| Member Success | Twenty actual logos in a static grid; three existing chapter figures |
| National | Concise national context, crest, founded year and chapter count |
| Chapter Life | Three real photos; responsive gallery |
| Rush | Compact heading, information link, and support band |
| Footer | Chapter identity, page links and social links |

Content is visible without JavaScript. Motion respects reduced-motion preferences;
there is no pinned scrolling, logo marquee, photo autoplay, or mock countdown.
The company logo provenance is recorded in `assets/logos/sources.json`.

## Preview and verification

Serve the repository locally and open `/v2/index.html`. Check small phones through
wide desktop widths, keyboard navigation, the membership controls, mobile menu,
local image loading, reduced motion, and the page without JavaScript. Rebuild
before deployment and verify the generated page and actual hosted assets.
