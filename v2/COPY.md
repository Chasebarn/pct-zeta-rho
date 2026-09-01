# Homepage copy: v2

Every word on `v2/index.html`, in reading order, with what each block is doing and
where the photography goes. Written so it can be handed to someone (or something) else to rewrite.

**Two house rules the current copy follows.** No em dashes anywhere. No invented
statistics: the three figures in section 03 are the three that already appear on
the live site, and nothing else numeric is claimed.

---

## 01 · HERO

Ground: deep purple. Behind the copy, a slow field of silk threads.

| Element | Copy |
|---|---|
| H1 | Phi Chi Theta |
| Sub | University of South Florida |
| Claim | Career preparation, leadership, and a business network before you graduate. |
| Next-up label | NEXT UP |
| Next-up body | Info Night · Wednesday, September 2 · 7:00 PM · BSN 225 |
| Button | Rush PCT |
| Foot bar, left | Professional Business Fraternity |
| Foot bar, centre | Scroll |
| Foot bar, right | Founded 1924 |

**Job of this section:** say who this is, make one claim, name the next real thing a
visitor can attend, and give them one place to click.

**Photography:** none. The section is typographic. This is worth questioning: a visitor reaches section 02 before seeing a single member.

---

## 02 · GRADUATE CONFIDENT

Ground: cream. Left column is an accordion; right column is one photograph that
cross-fades when a row is selected.

| Element | Copy |
|---|---|
| H2 | Graduate *confident.* |
| Lede | Three things you leave with. |
| Row 01 title | A network in your field |
| Row 01 body | Alumni, recruiters and speakers who already work where you want to. You meet them before you apply, not after. |
| Row 02 title | Leadership you have already done |
| Row 02 body | Chair an initiative. Run an event. Manage a budget. It goes on your resume because you did it, not because you attended. |
| Row 03 title | People who stay |
| Row 03 body | Formal, retreat, intramurals and everything between. The people who notice when you stop showing up, and who are still around after graduation. |

**Job of this section:** the value proposition, in three claims a prospect can check.

**Photography:** THREE photographs, one per row, all cropped to 4:5 portrait
(square on phones). Currently placeholders.
- `assets/ph/career-1.png` = a member with an alumnus at a career night
- `assets/ph/leadership-1.png` = a member running a chapter meeting
- `assets/ph/poly-1.png` = members at Formal

Because all three fill the same frame, they need to be shot or cropped
consistently. A wide group shot and a tight portrait in the same slot will fight.

---

## 03 · NUMBERS DON'T LIE

Ground: cream. Three figures, centred, counting up once when scrolled into view.

| Figure | Label |
|---|---|
| 95% | Members placed in internships or full-time roles |
| 3.60 | Chapter average GPA |
| 15 | "25 Under 25" honorees |

**Job of this section:** proof. These are the only three numbers claimed anywhere
on the page.

**Photography:** none, deliberately.

---

## 04 · WHERE MEMBERS HAVE PLACED

Ground: cream. Two belts of company names scrolling in opposite directions.

| Element | Copy |
|---|---|
| H2 | Where members have *placed.* |
| Sub | Internships and full-time roles taken by Zeta Rho members. |

**Belt one:** Morgan Stanley · Citi · Wells Fargo · PNC · Raymond James · Fisher
Investments · S&P Global · KPMG · Deloitte · Goldman Sachs

**Belt two:** Victoria's Secret · Formula 1 · New York Jets · USF · PwC · Amazon ·
Nestlé · Unilever · NBCUniversal · Lockheed Martin

**Job of this section:** recognition. A prospect should see one name they already
respect.

**Art:** each cell is a drop-in hook for `assets/logos/<slug>.svg`. Until those
exist it ships type-set wordmarks. Monochrome SVG preferred; no CSS change needed.

---

## 05 · YOUR COLLEGE SHOULD LOOK LIKE THIS

Ground: cream. One continuous band of tilted photographs, cut flat by the band's
bottom edge, scrolling slowly.

| Element | Copy |
|---|---|
| H2 | Your college should *look like this.* |

**Job of this section:** the emotional argument. It is the only section that is
almost entirely photography, and it is the one that most depends on real photos.

**Photography:** NINE, `assets/mem/m1.jpg` through `m9.jpg`. All currently
placeholders. Any aspect ratio works (they are cropped to fill), but keep the mix
of posed shots and phone candids. Current intended subjects: Fall Formal, Spring
Retreat, beach day, service day, Fall Summit, intramurals, a candid, recruitment
night, the whole chapter.

---

## 06 · YOUR PATH STARTS HERE

Ground: deep purple. Everything stops moving. One button.

| Element | Copy |
|---|---|
| H2 | Your path starts *here.* |
| Sub | Meet the chapter and see whether PCT belongs in your college experience. |
| Countdown label, before rush | RUSH BEGINS IN |
| Countdown label, during rush | Rush is underway. |
| Countdown units | DAYS · HOURS · MINUTES · SECONDS |
| Button | Rush PCT |

The countdown is state aware: ticking digits before rush, one line during it, and
it hides itself afterwards rather than showing a dead clock.

**Support band** (cream, below the CTA, deliberately quiet):

| Element | Copy |
|---|---|
| Text | Already know us? **Support the chapter.** |
| Links | Donate Today · Apparel |

---

## 07 · FOOTER

Lifted unchanged from the live site: chapter blurb, Pages column (Home, Rush,
Philanthropy, Apparel, Career Navigator, Fall Rush 2026), Connect column
(Instagram @pctusf, LinkedIn, Apparel Store, Donate).

---

## Still outstanding

1. **Company logo SVGs** at `assets/logos/<slug>.svg`, monochrome.
2. **Real photography.** Twelve slots total (3 in section 02, 9 in section 05).
   Every image on the page is currently a placeholder.
3. **Interest form and donate URLs.** Fifteen links still point at the old Google
   Site.
4. **Rush dates.** Everything on the page is built on Fall 2026 (September 2 is a
   Wednesday). The source flyer says 2025, where September 2 is a Tuesday.
