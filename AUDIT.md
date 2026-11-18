# PCT website audit

Reviewed November 18, 2026. Sources include the original Zeta Rho Google Site,
the chapter-maintained Board, Cabinet, advisor, awards and recruitment pages at [PCT USF](https://sites.google.com/view/pctusf/home), the national Phi Chi Theta directory, and
USF Muma College of Business profiles. Structured source records are in
[content/about-sources.json](content/about-sources.json) and
[content/rush-sources.json](content/rush-sources.json).

## Full site audit

| Section | Change |
| --- | --- |
| Navigation | Home, About and Rush stay in the navigation. The gold Rush PCT action appears once the hero has cleared. On phones the visible Rush link becomes the action. |
| Membership | The panels give students concrete examples of interview practice, alumni feedback, running events, volunteering and spending time together. The existing photographs stay with those stories. The 500+ graduates, 20+ awards and over $10,000 raised are figures supplied by the chapter. |
| Member Success | The title, figures and labels are centered. All three figures use the same color. Dark employer logos loop in opposite directions and keep moving through the visible part of the page. |
| National map | The italic 1924 and map pins are larger. The line beneath the map is gone. A school caption appears when someone points to, taps or focuses a pin. |
| Chapter Life | The photos autoplay in their own arc above the compact Rush invitation. “Learn about Rush” opens the Rush page. Pause controls and reduced-motion support keep the section usable. |
| Rush | A single heading leads into an illustrated journey from the first event to the invitation to apply. The old schedule lives in a disclosure. “Fill out interest form” at the end opens the separate form. The dues question was removed at the chapter’s request. |
| Rush interest form | The form has its own address. Existing saved submissions and validation use the same Neon-backed endpoint. Previous Rush signup links forward to the new page. |
| About | Johnny’s ProVise discussion photograph opens the page. Portraits of the six national founders illustrate a short timeline. Executive Board, Cabinet and the faculty advisor sit in one indexed directory. |
| Footer | A chapter wordmark carries through the deeper purple footer. Direct links cover the story, outcomes, photos, Rush and chapter contact information. |

## Verification

The build validates five pages, links, anchors and images. Nine backend tests cover validation, failed saves, rate limiting and duplicate handling. WebKit and Chrome checks cover portrait and landscape layouts, 200% text, keyboard navigation, the map, photos, logo motion and the separate signup flow.

## Recruitment dates

The latest chapter schedule covers Fall 2026. The next event dates are pending. About preserves the officer roster as supplied by the chapter.

## Hosting

The production site is [pct-zeta-rho.vercel.app](https://pct-zeta-rho.vercel.app). Vercel serves the site and the Rush API. Neon stores consented submissions by recruitment cycle.
