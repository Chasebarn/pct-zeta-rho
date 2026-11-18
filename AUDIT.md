# PCT website audit

Reviewed November 18, 2026. Sources include the original Zeta Rho Google Site,
the chapter-maintained Board, Cabinet, advisor, awards and recruitment pages at [PCT USF](https://sites.google.com/view/pctusf/home), the national Phi Chi Theta directory, and
USF Muma College of Business profiles. Structured source records are in
[content/about-sources.json](content/about-sources.json) and
[content/rush-sources.json](content/rush-sources.json).

## This revision

| Page | What changed after the walkthrough |
| --- | --- |
| Home opening | The purple hero fills the opening viewport. The footer rail and “Explore membership” are gone. “Rush PCT” is the primary action. |
| Membership | Professional Connections, Leadership Experience and Chapter Community show what a USF student gains. Each has chapter photography. Only one panel opens at a time on phones, and selecting a lower row keeps that row in view. There are no links inside these panels. |
| Member Success | Enlarged and aligned the figures with the logo rows. Removed the member anecdote and old-site link. The employer rows follow vertical page scroll in opposite directions. The first and last marks reach the readable area before each row leaves view. All 20 marks remain available with scripts disabled or reduced motion enabled. |
| National | Brief copy names the national membership program, mentoring and scholarships. The custom map uses sourced school coordinates. It starts in Tampa, and hover, tap or keyboard selection updates the school caption underneath. |
| Chapter Life and Rush | The original photo arc uses Johnny’s archive and moves with page scroll. Image edges are visible above and below the invitation. One button opens the form on Rush. |
| Rush | Rebuilt from the original V2 layout. The opening explains what to ask at Info Night. Eligibility, events and common questions lead to the dedicated form. The previous schedule can be opened separately. Sharing uses the live Rush link, with a copy fallback. |
| About | Leads with Johnny’s full-chapter photo and the Chicago and Tampa founding stories. Selected projects and awards precede the officer directory. The old Service URL goes to the service section on About. |
| Site frame | Updated the footer, browser favicon and link preview artwork. Privacy is linked from the footer. |

## Verification

- The Home, Rush, About and Privacy pages pass the build and local link, image, heading and anchor checks.
- Nine backend tests cover validation, failed saves, rate limiting and duplicate handling.
- WebKit and Chrome browser runs check the hero, membership panel selection, logo movement, map hover and tap, keyboard map selection, photo overlap, sharing fallback, form correction and the recruitment officer link.
- Phone portrait, landscape, desktop, reduced motion and enlarged text are tested in browser emulation.

## Recruitment details

The chapter’s latest schedule covers Fall 2026. Spring 2027 dates, locations, attire and dues await the next chapter announcement. About preserves the roster as supplied by the chapter.

## Hosting

The production site is [pct-zeta-rho.vercel.app](https://pct-zeta-rho.vercel.app). Vercel handles deployment and the Rush API. Neon stores the consented submissions by recruitment cycle.
