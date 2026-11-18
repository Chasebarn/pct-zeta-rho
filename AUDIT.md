# PCT website audit

Reviewed November 18, 2026. Sources include the original Zeta Rho Google Site,
the chapter-maintained Board, Cabinet, advisor, awards and recruitment pages at [PCT USF](https://sites.google.com/view/pctusf/home), the national Phi Chi Theta directory, and
USF Muma College of Business profiles. Structured source records are in
[content/about-sources.json](content/about-sources.json) and
[content/rush-sources.json](content/rush-sources.json).

## Full site audit

| Section | Change |
| --- | --- |
| Navigation | One Rush link stays visible on desktop and mobile. Its gold background fades in after the hero clears. |
| Membership | Each panel pairs a chapter-supplied figure with relevant examples. Professional Connections covers 80+ active members, 500+ alumni, guest speakers and networking dinners. Leadership Experience names the chapter’s national recognition. Chapter Community covers over $10,000 raised for local causes. On desktop, the photo stays top-aligned as the panels change. |
| Member Success | The title, figures and labels are centered. All three figures use the same color. Opposing logo rows follow vertical scrolling immediately and hold their position when scrolling stops. The rows wrap seamlessly without a visible endpoint. |
| National map | A school caption appears when someone points to, taps or focuses a pin. The caption and highlight fade out on exit without changing the section height. |
| Chapter Life | Photos autoplay in a shallow arc above the Rush invitation. Each portrait stays fully in frame while visible. With reduced motion, all photos are available in a manually scrollable row. |
| Rush | A single heading leads into an illustrated journey from the first event to the invitation to apply. The old schedule lives in a disclosure. “Fill out interest form” at the end opens the separate form. The dues question was removed at the chapter’s request. |
| Rush interest form | The form has its own address. Existing saved submissions and validation use the same Neon-backed endpoint. Previous Rush signup links forward to the new page. |
| About | Johnny’s ProVise discussion photograph opens the page. Portraits of the six national founders illustrate a short timeline. Executive Board, Cabinet and the faculty advisor sit in one indexed directory. |
| Footer | The footer uses solid chapter plum and whitespace between groups. Direct links cover the story, outcomes, photos, Rush and chapter contact information. |

## Verification

The build validates five pages, links, anchors and images. Nine backend tests cover validation, failed saves, rate limiting and duplicate handling. WebKit and Chrome checks cover portrait and landscape layouts, 200% text, keyboard navigation, the map, photos, logo motion and the separate signup flow.

## Recruitment dates

The latest chapter schedule covers Fall 2026. The next event dates are pending. About preserves the officer roster as supplied by the chapter.

## Hosting

The production site is [pct-zeta-rho.vercel.app](https://pct-zeta-rho.vercel.app). Vercel serves the site and the Rush API. Neon stores consented submissions by recruitment cycle.
