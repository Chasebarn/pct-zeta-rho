# PCT website audit

Reviewed November 18, 2026. Sources include the original Zeta Rho Google Site,
its Rush and philanthropy pages, the national Phi Chi Theta directory, and
USF Muma College of Business profiles. Structured source records are in
[content/about-sources.json](content/about-sources.json) and
[content/rush-sources.json](content/rush-sources.json).

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
| Old recruitment schedule could be mistaken for current events | The new Rush page offers schedule updates, with no invented dates, locations, dress codes, or selection criteria. |
| Career Navigator offers an inactive signup | New navigation points to working USF career resources. Its old route redirects there. |
| Separate pages lacked consistent navigation and content hierarchy | Home, Rush, About, Service, and Privacy share the chapter frame, typography, and mobile menu. |
| Current officer and advisor names lack a public source | About provides the Executive Board, CAB, and advisor contact route. Named profiles are dated. The current roster still needs chapter confirmation. |

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

The chapter still needs to supply current Rush dates, event-specific attire,
attendance and selection requirements, dues, and the current Executive Board,
CAB, and advisor names and terms. The public BullsConnect group requires USF
sign-in for its member area. Its public listing does not identify this roster.

The initial Vercel deployment and Neon project were provisioned through their
temporary ownership-claim flows because no account connection was available.
Claim Vercel before its deployment expires. Neon expires after 72 hours unless
claimed. Claiming Neon rotates the database credentials, so the Vercel runtime
environment must be updated immediately after transfer. Credentials and claim
secrets are excluded from the repository.
