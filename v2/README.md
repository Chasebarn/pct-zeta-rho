# Homepage v2 — the premium mock

Open `v2/index.html`. It does not touch the live homepage (`index.html`).

## The rule this is built on

**Every section has one signature interaction and no more than one.** Scrolling changes
HOW information is communicated, not just what:
atmosphere -> interaction -> scale/proof -> emotion -> action.

| # | Section | Communicates | The one move |
|---|---------|--------------|--------------|
| 01 | Hero | Atmosphere | Silk canvas that **settles and stops** (~4.6s), organising as it decays; pulls toward the Rush button on hover |
| 02 | Graduate confident | Interaction | Persistent-image accordion; curtain wipe, gold rail; **row 03 breaks into overlapping polaroids** |
| 03 | Numbers -> Placements | Scale, then credibility | Pinned horizontal. 95% with wordmarks orbiting it, 3.60 out of a transcript grid, 15 hollow with ticks. Releases into two opposing logo belts |
| 04 | PCT in real life | Emotion | 3D depth rail that **auto-advances**, and hands control over permanently on first touch |
| 05 | Your path starts here | Action | Everything stops. Plus the `01 INTRO / 02 GROW / 03 PROOF / 04 EXPERIENCE / 05 RUSH` edge rail |

## Editing

Sections live in `v2/parts/NN-name.{html,css,js}`. After editing any part:

    python3 v2/build.py

That reassembles `v2/index.html`, rewrites asset paths for the `/v2/` directory, and
orders the JS so `window.pctMotion` is defined before any section init runs.

## Placeholders

`assets/ph/*.png` are branded stand-ins, not real photographs. Swap them at the same
aspect ratios: 4:5 editorial, 1:1 polaroids, 3:2 rail.

The logo marquee uses **type-set wordmarks, not real brand logos** (we have no licensed
files). Each cell is built so a real logo `<img>` drops in with no CSS change.

## Known follow-ups

- 03-proof: some reduced-motion resets are dead rules; verify each leaves the FINISHED
  state, and move the `measure()` call out of the resize rAF.
- 01-hero: `getBoundingClientRect` runs per mousemove; cache it on enter/resize.
- Photography is placeholder throughout, and the mixed polished/candid register the
  rail is designed for only lands once real photos go in.
