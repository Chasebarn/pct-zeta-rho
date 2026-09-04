# Homepage copy pull

Every word on `v2/index.html` as it stands tonight, in reading order, with what
each block is doing and which images feed it.

**House rules the copy follows.** No em dashes anywhere. No invented statistics:
every number below already appears on the live site.

**Live:** https://chasebarn.github.io/pct-zeta-rho/v2/index.html
**Seven sections:** header, hero, value, proof, national, photography, CTA, footer.

---

## 00 · HEADER

Transparent over the hero, turns cream and sticky once you scroll past it.

| Element | Copy |
|---|---|
| Brand | Phi Chi Theta |
| Brand sub | Zeta Rho · USF |
| Nav | Home · Philanthropy · Apparel · Career |
| Button | Rush PCT |

---

## 01 · HERO

Deep purple. Centred on desktop, left aligned on mobile. Behind the copy, a slow
field of silk threads that leans toward the pointer.

| Element | Copy |
|---|---|
| H1 | Phi Chi Theta |
| Sub | University of South Florida |
| Claim | Career preparation, leadership, and a business network before you graduate. |
| Next-up label | NEXT UP |
| Next-up body | Info Night · Wednesday, September 2 · 7:00 PM · BSN 225 |
| Button | Rush PCT |
| Foot bar | Professional Business Fraternity · Scroll · Founded 1924 |

**Job:** say who this is, make one claim, name the next real thing to attend, give
one place to click.

**Photography:** none. Typographic by design.

**KNOWN DEFECT:** the next-up line is hardcoded. Once Info Night passes it will
still advertise it.

---

## 02 · MORE THAN JUST A BUSINESS FRATERNITY

Cream. Accordion: opening a row closes the other two, and the photograph beside
it cross-fades.

| Element | Copy |
|---|---|
| H2 | More than just a business fraternity. |
| 1 title | Professional development |
| 1 body | Speakers, resume and LinkedIn workshops, and a full day of training at Fall Summit. |
| 2 title | Philanthropy |
| 2 body | Members run the fundraisers and volunteer days, not just attend them. Recent partners: Hillsborough Education Foundation, JA Finance Park, Parkland Cares. |
| 3 title | Chapter life |
| 3 body | Intramurals, Fall Formal, Spring Retreat. Members refer and vouch for each other long after graduation. |

**Job:** the value proposition, as three real parts of the chapter a prospect can
go and check.

**Photography:** THREE, all **real**. `photo-letters.jpg`, `photo-service.jpg`,
`photo-fundraiser.jpg`. Square on desktop, 4:3 under 600px.

**There is no sub-line.** It said "Three parts of the chapter. Members run all
three" and restated the three headings directly beneath it.

---

## 03 · WHAT WE HAVE TO SHOW FOR IT

Cream. Two belts of company wordmarks scrolling in opposite directions, then the
three figures, which count up once when first scrolled into view.

| Element | Copy |
|---|---|
| H2 | What we have to show for it. |

**Belt one:** Goldman Sachs · Morgan Stanley · Citi · Wells Fargo · PNC · Raymond
James · Fisher Investments · S&P Global · KPMG · Deloitte

**Belt two:** PwC · Amazon · Nestlé · Unilever · NBCUniversal · Lockheed Martin ·
Victoria's Secret · Formula 1 · New York Jets · USF

| Figure | Label |
|---|---|
| 95% | Members placed in internships or full-time roles |
| 3.60 | Chapter average GPA |
| 15 | "25 Under 25" honorees |

**Job:** proof. Recognition first because it costs the reader nothing, then the
rate.

**Art:** every belt cell is a drop-in hook for `assets/logos/<slug>.svg`,
monochrome preferred. Until those exist it ships type-set wordmarks.

**OUTSTANDING:** this section has no gold anywhere and you have flagged it as
dull. Unresolved.

---

## 04 · A NATIONAL FRATERNITY SINCE 1924

Deep purple. Zero interaction, nothing moves. Crest locked to the heading.

| Element | Copy |
|---|---|
| H2 | A national fraternity since *1924.* |
| Facts | 40+ Chapters · 23,000+ Members nationwide · 20+ Chapter awards |
| Body | You are not joining one chapter at one school. You are joining an alumni network in the city you move to after graduation, and a name that the person reading your resume in Charlotte or Chicago already recognises. |

**Job:** two things at once. Institutional credibility, and the still, dark break
that keeps the logo belts and the photography from sitting back to back.

**Art:** `assets/crest.png`, full colour, beside the heading.

---

## 05 · COLLEGE SHOULD LOOK LIKE THIS

Cream. A wheel: photographs on a circle whose centre sits below the section, cut
flat along the bottom by the purple of the CTA.

| Element | Copy |
|---|---|
| H2 | College should look like this. |

**Job:** the emotional argument. The section that most depends on real photographs.

**Photography:** FOUR frames in rotation, THREE of them **real**
(`photo-fundraiser`, `photo-letters`, `photo-service`). One placeholder left:
`assets/mem/m2.jpg`. **One more real photo finishes this section entirely.**

---

## 07 · YOUR PATH STARTS HERE

Deep purple, lit from a single source above. Everything stops. One button.

| Element | Copy |
|---|---|
| H2 | Your path starts *here.* |
| Sub | Rush is six events and it costs nothing. Come to one and find out whether this is your chapter. |
| Countdown label | SPRING RUSH BEGINS IN |
| Countdown units | Days · Hours · Minutes · Seconds |
| Button | Rush PCT |
| Support band | Already know us? **Support the chapter.** · Donate Today · Apparel |

The button flares once when scrolled to, then settles.

**PLACEHOLDER:** the countdown runs to a made-up Spring 2027 date because Fall
2026 rush has already begun. Replace with the real dates.

---

## 99 · FOOTER

Chapter blurb, Pages column (Home, Rush, Philanthropy, Apparel, Career Navigator,
Fall Rush 2026), Connect column (Instagram · @pctusf, LinkedIn, Apparel Store,
Donate), and the base row.

---

## Outstanding

1. **One real photograph** for `assets/mem/m2.jpg` finishes section 05.
2. **Company logo SVGs** at `assets/logos/<slug>.svg`, monochrome.
3. **Real spring rush dates** to replace the placeholder countdown.
4. **Gold in section 03.** Flagged, not resolved.
5. **The hero's next-up line is hardcoded** and will advertise a past event.
6. **Interest form and donate URLs.** Fifteen links still point at the old Google
   Site.
7. **Rush year.** Everything is built on Fall 2026, where September 2 is a
   Wednesday. The source flyer says 2025, where September 2 is a Tuesday. Still
   unconfirmed.
