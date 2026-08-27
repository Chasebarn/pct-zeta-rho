# PCT homepage v2 — build contract

Output goes to `v2/index.html` (assembled by the lead from your parts).
**You write three files and nothing else.** Do not touch any other file in the repo.

  v2/parts/NN-<name>.html   the <section> markup only (no <html>/<head>/<body>)
  v2/parts/NN-<name>.css    styles for your section only, every selector scoped
  v2/parts/NN-<name>.js     one global init function, see below

## THE ONE HARD RULE

**Every section has ONE signature interaction and no more than one.**
Hero = canvas. Graduate Confident = image accordion. Proof = pinned numbers.
Placements = logo marquee. Experience = 3D photo rail. CTA = restrained.

Do not add parallax + magnetic cursor + particles + tilt + blobs on top of your one
move. The flex is "this could only have been built for this chapter", not "look how
many animations I know".

## THE POINT

Scrolling must change HOW information is communicated, not just what:
atmosphere -> interaction -> scale/proof -> emotion -> action.
One brand throughout: same type, colour, spacing, easing, border and photo treatment.

## DESIGN TOKENS (already defined in v2/tokens.css, just use them)

  --purple-deep #241733   --purple #4b2e83     --purple-hero #2b1c3d
  --gold #c9a227          --gold-soft #e6c65b  --gold-ink #8a6d14
  --paper #faf8f3         --paper-deep #f2eee4
  --ink #191221           --ink-soft #453a52   --ink-mute #6f6580
  --line #e8e2d4 (on cream)   --line-dark #3a2b52 (on purple)
  --wrap 1240px  --gutter clamp(1.25rem,4vw,3rem)  --section clamp(5rem,10vw,9rem)
  --ease .22,.61,.36,1     --dur 620ms

FONTS: 'Instrument Serif' (display, **weight 400 only**, italic available) and
'Inter' (text). Never Arial. Never synthetic-bold the serif.
GOLD RULE: --gold only on dark grounds. On cream use --gold-ink (4.62:1). Never
--gold on --paper (2.28:1, fails contrast).

## NON-NEGOTIABLE ENGINEERING

1. **No JS, no content.** Never ship an element whose readable state depends on JS.
   Base CSS = the finished, visible state. JS only adds motion. Test by disabling JS:
   all copy must be on screen and all links clickable.
2. **prefers-reduced-motion**: every loop, transition and transform must resolve to
   its FINISHED state (never its start state) under
   `@media (prefers-reduced-motion: reduce)`.
3. **Compositor only**: animate `transform` and `opacity`. Never animate width,
   height, top, left, or `transition: all`. `will-change` only on the 1-3 elements
   that animate continuously, never on a repeated collection.
4. **No layout reads inside rAF.** Measure on load and on resize, cache it, then only
   write transforms in the loop.
5. **Every <img>** needs width, height, alt, and `loading="lazy"` + `decoding="async"`
   unless it is above the fold. Images must never cause layout shift.
6. Vanilla only. No frameworks, no libraries, no new dependencies, no build step.
7. Touch targets >= 44px. Keyboard reachable. Visible :focus-visible ring
   (gold-soft on dark, purple on cream).

## MOBILE GETS ITS OWN CHOREOGRAPHY

Do not shrink the desktop version. Under 768px your section must use a different,
appropriate execution (stated per section below). Nothing may pin, hijack scroll, or
scroll horizontally on a phone.

## YOUR JS FILE

Export exactly one global init, named for your section, that the lead calls once:

    window.pctInitHero = function () { ... }

It must: no-op safely if its elements are absent; register any teardown on the shared
`window.pctMotion.onReduce(fn)` hook so reduced-motion can stop it mid-session; and
never throw (wrap risky work in try/catch so one section cannot kill the page).

## PLACEHOLDER PHOTOGRAPHY (already rendered, use these paths)

  assets/ph/career-1.png  leadership-1.png  social-1.png     1000x1250 (4:5)
  assets/ph/poly-1..5.png                                     700x700  (1:1)
  assets/ph/rail-formal|retreat|summit|service|intra|beach|speaker|group.png  1200x800 (3:2)

They are branded purple placeholders. Treat them as real photographs: same rounding
(none), same 1px --line-dark border treatment, same object-fit: cover.
