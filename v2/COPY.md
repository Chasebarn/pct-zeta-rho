# Homepage copy pull: v2

Every word on `v2/index.html`, in reading order, with what each block is doing and
which images feed it. Written so it can be handed to someone (or something) else to
rewrite.

**House rules the copy follows.** No em dashes anywhere. No invented statistics: every
number below already appears on the live site.

**Live:** https://chasebarn.github.io/pct-zeta-rho/v2/index.html

---

## 00 · HEADER

Deep purple, static (it scrolls away and does not come back). No JavaScript.

| Element | Copy |
|---|---|
| Brand | Phi Chi Theta |
| Brand sub | Zeta Rho · USF |
| Nav | Home · Philanthropy · Apparel · Career |
| Button | Rush PCT |

**Job:** be a website. v2 previously had no navigation at all, which is most of why
it read as a landing-page mock rather than a real organization's site.

**Art:** `assets/crest.png`.

---

## 01 · HERO

Deep purple. Behind the copy, a slow field of silk threads that leans toward the pointer.

| Element | Copy |
|---|---|
| H1 | Phi Chi Theta |
| Sub | University of South Florida |
| Claim | Career preparation, leadership, and a business network before you graduate. |
| Next-up label | NEXT UP |
| Next-up body | Info Night · Wednesday, September 2 · 7:00 PM · BSN 225 |
| Button | Rush PCT |
| Foot bar | Professional Business Fraternity · Scroll · Founded 1924 |

**Job:** say who this is, make one claim, name the next real thing to attend, give one
place to click.

**Photography:** none. Typographic by design.

**KNOWN DEFECT:** the next-up line is hardcoded. Section 05's schedule is date-aware, so
once Info Night passes the hero still advertises it while the schedule marks it Past.
See "Still outstanding" below.

---

## 02 · MORE THAN JUST A BUSINESS FRATERNITY

Cream. Three parts of the chapter, all open at once. **Zero interaction, no JavaScript.**

| Element | Copy |
|---|---|
| H2 | More than *just* a business fraternity. |
| Lede | Three parts of the chapter. Members run all three. |
| 1 title | Professional development |
| 1 body | Speakers, resume and LinkedIn workshops, and a full day of training at Fall Summit. |
| 1 link | Career Navigator → `career.html` |
| 2 title | Philanthropy |
| 2 body | Members run the fundraisers and volunteer days, not just attend them. Recent partners: Hillsborough Education Foundation, JA Finance Park, Parkland Cares. |
| 2 link | Our impact → `philanthropy.html` |
| 3 title | Chapter life |
| 3 body | Intramurals, Fall Formal, Spring Retreat. Members refer and vouch for each other long after graduation. |
| 3 link | Meet the chapter → `fallrush.html` |

**Job:** the value proposition, as three real parts of the chapter a prospect can go and
check, each with a door to the page that proves it.

**Photography:** ONE, and it is **real**. `assets/photo-service.jpg`, three members in
chapter shirts loading roof shingles at a service project. Cropped square, because the
source is 1300x1300 and a 4:5 crop cut a member out of frame.

---

## 03 · WHERE MEMBERS HAVE PLACED, BY THE NUMBERS

Cream. The old "Numbers don't lie." and "Where members have placed." are now one section:
belts first, figures underneath, one heading.

| Element | Copy |
|---|---|
| H2 | Where members have placed, by the *numbers.* |

**Belt one:** Goldman Sachs · Morgan Stanley · Citi · Wells Fargo · PNC · Raymond James ·
Fisher Investments · S&P Global · KPMG · Deloitte

**Belt two:** PwC · Amazon · Nestlé · Unilever · NBCUniversal · Lockheed Martin ·
Victoria's Secret · Formula 1 · New York Jets · USF

| Figure | Label |
|---|---|
| 95% | Members placed in internships or full-time roles |
| 3.60 | Chapter average GPA |
| 15 | "25 Under 25" honorees |

**Job:** proof. Recognition first because it costs the reader nothing, then the rate.

**Art:** every belt cell is a drop-in hook for `assets/logos/<slug>.svg`, monochrome
preferred. Until those exist it ships type-set wordmarks. No CSS change needed.

---

## 04 · A NATIONAL FRATERNITY SINCE 1924

Deep purple. **Zero interaction. Nothing here ever moves.**

| Element | Copy |
|---|---|
| H2 | A national fraternity since *1924.* |
| Facts | 40+ Chapters · 23,000+ Members nationwide · 20+ Chapter awards |
| Body | Phi Chi Theta has operated as a national professional business fraternity since 1924. Membership connects Zeta Rho to alumni and chapters in cities across the country, which matters when members recruit, relocate, or need an introduction in a new market. |
| Charter line | Zeta Rho was chartered at the University of South Florida in September 2018 by 18 founding business students. |

**Job:** two things at once. Institutional credibility the page had dropped, and the
separator that keeps the logo belt and the photo band from sitting back to back. Its
stillness is the whole point.

**Photography:** none.

---

## 05 · HOW TO JOIN PCT

Deeper cream. The section v2 had dropped.

| Element | Copy |
|---|---|
| H2 | How to join *PCT.* |
| Sub | Six events, open to business and economics majors and minors. Rush is free. |
| 01 | **Show up.** Info Night is Wednesday, September 2 at 7:00 PM in BSN 225. You do not need prior experience or to know anyone there. |
| 02 | **Meet the chapter.** Talk with members and exec in person. Bring the real questions: time commitment, dues, GPA, what the first semester looks like. |
| 03 | **Both sides decide.** You are getting to know us while we get to know you. Nothing is settled on night one. |
| Closer | *Yours either way.* You keep the resume, the practice, and the contacts whether or not you join. |
| Link | How rush works → `rush.html` |

**The six events** (read from `assets/rush-events.ics`, all real):

| # | Event | When | Where |
|---|---|---|---|
| 1 | Info Night | Wed, September 2, 7:00 PM | BSN 225, Muma College of Business |
| 2 | Professional Workshop | Fri, September 4, 7:00 PM | BSN 225 |
| 3 | Alumni Panel | Wed, September 9, 7:00 PM | BSN 225 |
| 4 | Phi Chi Fest | Fri, September 11, 7:00 PM | BSN 225 |
| 5 | Quick Queue | Wed, September 16, 7:00 PM | MSC 2709, Marshall Student Center |
| 6 | Invite Only | Fri, September 18, 7:00 PM | Location shared with invited rushees |

**Job:** mechanics. Exactly what happens, when, and where. It is the least fakeable
content on the page.

**Interaction:** the schedule resolves against today's date. Past events go quiet, the
next one is marked, and after the last event the list is replaced by one line.

---

## 06 · YOUR COLLEGE SHOULD LOOK LIKE THIS

Cream. One continuous band of photography, cut flat along the bottom by the purple of
section 07.

| Element | Copy |
|---|---|
| H2 | Your college should *look like this.* |
| Lede | Fall Formal, Spring Retreat, Fall Summit, intramurals, and the fundraisers in between. |

**Job:** the emotional argument. The section that most depends on real photographs.

**Photography:** SEVEN frames. Two are **real**:
- `assets/photo-fundraiser.jpg`: Pie a Phi Chi, Moffitt Cancer Center
- `assets/photo-letters.jpg`: members in Fall Rush shirts writing cards

Five are still placeholders: `assets/mem/m2, m1, m5, m6, m8`. Any aspect ratio works
(they are cropped to fill). Keep the mix of posed shots and phone candids. **Seven, not
nine**: the count has to match the seven-value tilt cycle or the tilts jump at the loop.

---

## 07 · YOUR PATH STARTS HERE

Deep purple. Everything stops. One button.

| Element | Copy |
|---|---|
| H2 | Your path starts *here.* |
| Sub | Meet the chapter and see whether PCT belongs in your college experience. |
| Countdown, before rush | RUSH BEGINS IN + Days / Hours / Minutes / Seconds |
| Countdown, during rush | Rush is underway. |
| Button | Rush PCT |
| Support band | Already know us? **Support the chapter.** · Donate Today · Apparel |

The countdown hides itself after rush rather than showing a dead clock.

---

## 99 · FOOTER

Chapter blurb, Pages column (Home, Rush, Philanthropy, Apparel, Career Navigator, Fall
Rush 2026), Connect column (Instagram · @pctusf, LinkedIn, Apparel Store, Donate).

---

## Still outstanding

1. **Five real photographs** for the band (`assets/mem/m2, m1, m5, m6, m8`). Two of seven
   frames are real now. The contrast between them and the remaining grey rectangles is
   the most visible unfinished thing on the page.
2. **Company logo SVGs** at `assets/logos/<slug>.svg`, monochrome.
3. **The hero's next-up line is hardcoded** and can contradict section 05's date-aware
   schedule. Fixing it means deciding what the hero says once rush is over: name the next
   event, say rush has ended, or drop the line. That is an editorial call, not a technical
   one.
4. **Interest form and donate URLs.** Fifteen links still point at the old Google Site.
5. **Rush year.** Everything is built on Fall 2026, where September 2 is a Wednesday. The
   source flyer says 2025, where September 2 is a Tuesday. Still unconfirmed.
