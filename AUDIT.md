# PCT website audit

Reviewed November 18, 2026. Sources include the original Zeta Rho Google Site,
the chapter-maintained Board, Cabinet, advisor, awards and recruitment pages at [PCT USF](https://sites.google.com/view/pctusf/home), the national Phi Chi Theta directory, and
USF Muma College of Business profiles. Structured source records are in
[content/about-sources.json](content/about-sources.json) and
[content/rush-sources.json](content/rush-sources.json).

## Recruitment journey and mobile review

| What a prospective member experienced | Released change |
| --- | --- |
| At 390px wide, the Rush interest form started 4,032px down the page. Readers passed a full past schedule before they could act. | The first screen offers signup and events. The schedule shows what students do at Rush, with Fall 2026 dates available on demand. Spring 2027 dates are pending. |
| Gold buttons with the same wording could lead to either the Rush introduction or the form. | “Explore Rush” opens the guide. “Get Rush updates” opens signup. On phones the header shortcut appears when the hero action scrolls away. |
| Membership panels made general claims and changed photos. | Each panel now pairs an activity with its photograph and a relevant next step. Visitors can meet a USF honoree, find a Cabinet officer or go to chapter life. Phone panels open in place. |
| The employer wall gave readers twenty names without anyone’s story. | The figures and the two desktop or three phone logo rows lead into Eric Torres’s two PwC internships and Dallas offer. The member’s USF profile and the chapter’s figures are linked separately. |
| The same recruitment visual appeared in different contexts, and phones downloaded a 1,358,044-byte JPEG. | Fourteen chapter photographs from Johnny’s website archive now illustrate member activities, Rush, About and Service. A 390px-wide phone at 2× density loads a 32,082-byte Rush photo. Each main photo has a description and three sizes. |
| About required a long read to find an officer or a way to contact the chapter. | Leadership, Awards and Contact are available in the first screen. Rush links directly to the VP of Recruitment. |
| With doubled browser text at 320px the brand collided with navigation, and the expanded Rush schedule extended beyond the phone. | The header adapts to the space available. Long words, date columns, the footer and menu reflow for enlarged text. |
| A recruitment form error could survive correction. A successful save left a blank form in view. | Errors identify and focus the field. Answers survive a failed save. A successful save displays a single confirmation with a link to the recruitment officer. |
| The footer invited donations through a chapter page whose donation buttons pointed to a placeholder. | The dead link was removed. The footer still reaches the chapter contact, apparel store, and USF career resources. |

The review covers browser testing with touch, keyboard, reduced motion, disabled scripts, phone landscape, and 200% browser text. Native share outcomes and connection failures were simulated. Physical iPhone hardware was outside this test.

## Earlier source and content audit

| Finding | Result |
| --- | --- |
| Phone membership selection could pull the page back into the hero or hide the selected heading | Phone disclosures expand within their own rows and leave preceding content open. The published 390px test retained scrollY 746 before and after the Leadership tap. |
| Long photo wipe and independent text change | Desktop uses a short crossfade in a stable frame. A real professional-event photo replaces the former foreground-back crop. |
| Membership descriptions separated from their controls in previous previews | The original panel structure pairs each label, description, and photo. Plus/minus decorations are removed. |
| Employer movement starts late and travels quickly | Rows begin on entry, with longer scroll travel, earlier edge fades, and shorter logo rows. Two rows appear on desktop and three on phones. |
| Figures had no public source link | Original site images visibly confirm 95%, 3.60, and 15. Home labels them chapter-reported and links the original source. This verifies what the chapter reports, with no independent cohort audit. |
| Map waits too long and hides the local marker | USF stays visible; other dots enter with a shorter stagger and no overshoot. Real campus coordinates and the verified 46-campus count are retained. |
| Carousel seam repeats the same photo in neighboring positions | The 32-slot order now has three distinct images across every neighboring group, including the wraparound. |
| Rush heading abruptly changes height at 768px | The closing title scales and wraps naturally across widths. |
| Original interest links resolve to broken placeholders | The new form posts to Vercel and saves consented interest in Neon. |
| Old recruitment schedule could be mistaken for current events | Rush labels the September 2026 poster as a past cycle. The next dates are unpublished. The chapter FAQ and Rush Tips supply attire, absence, application and bid guidance. |
| Career Navigator offers an inactive signup | New navigation points to working USF career resources. Its old route redirects there. |
| Separate pages lacked consistent navigation and content hierarchy | Home, Rush, About, Service, and Privacy share the chapter frame, typography, and mobile menu. |
| The first review missed the Board menu on a second chapter site | About now includes all seven executive officers, nine Cabinet chairs, and faculty advisor Carrington Price Jr., with 17 matched chapter portraits. The chapter lists no term. |
| The first About page omitted chapter awards and three named honorees | About now includes national and regional chapter awards and all six honorees profiled by the chapter for 2023–24 through 2025–26. Every honoree links to a USF profile. |

## Completed verification

- Builds and JavaScript syntax checks pass.
- Five pages pass local link, anchor, heading, and image-label checks.
- Nine backend tests cover validation, failed saves, privacy, rate limiting, and duplicate handling.
- Published Home, Rush, and About were checked at 320px, 390px, 768px, and desktop widths.
- Published primary pages, legacy redirects, 404, and database health return the expected responses.
- Native mobile navigation and FAQ disclosures work.
- Reduced motion shows all 20 logos and final statistics, with a still photo carousel.
- With scripts unavailable, all membership content and all 20 employer marks remain visible.
- A browser submission on the published Rush page created one real Neon record.
  Concurrent retries preserved one record. The synthetic test entry was removed.

## Before the next recruitment cycle

The latest chapter poster covers Fall 2026. Add the next event dates, times, locations, per-event dress codes, and updated dues when the chapter publishes them. Record the roster term when available.

## Hosting

The production site is [pct-zeta-rho.vercel.app](https://pct-zeta-rho.vercel.app). The original Vercel and Neon projects were transferred to the owner’s accounts. The signup database is the same database initialized for this site.
