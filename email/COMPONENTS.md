# PCT email component kit

Every template in `email/` is built from these blocks. **Do not invent new styling.**
Copy a block, change the words. If you need something that is not here, compose it
from what is here.

Reference implementation: `email/rush-day-of.html` (the proven Outlook build).

---

## The five rules

1. **600px table, fully inline styles, `role="presentation"` on every layout table.**
   No `<style>` block, no classes, no external CSS. Outlook's compose box and the
   Word rendering engine both discard them.

2. **Purple panels are IMAGES. Cream panels are live text.**
   Outlook dark mode recolors live backgrounds but never touches images. If live text
   sits on a purple `<td>`, dark mode inverts the text and leaves the art, and the
   email bands. So: hero, closing panel, buttons on purple, and the footer are baked
   PNGs. Everything readable and editable lives on cream `#faf8f3`.

3. **Live text may only use: font-family, font-size, font-weight, color, line-height,
   padding on `<td>`.** Never letter-spacing on live text (Outlook drops it), never
   `background-image` behind text, never `border-radius` on a live button.

4. **Never Arial.** Font stack is exactly:
   `font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif;`
   and for the rare live serif: `font-family:'Instrument Serif',Georgia,serif;`

5. **No em dashes anywhere.** Use a period, a colon, or "and". Owner's rule.

## Palette

| token | hex | use |
|---|---|---|
| purple-deep | `#241733` | bookend panels (as baked art only) |
| purple | `#4b2e83` | links, accents on cream |
| gold | `#c9a227` | buttons (baked), rules on dark |
| gold-soft | `#e6c65b` | display accents on dark |
| gold-ink | `#8a6d14` | **the only gold allowed on cream** (4.62:1) |
| paper | `#faf8f3` | the readable panel |
| ink | `#191221` | headings, bold leads |
| ink-soft | `#453a52` | body copy |
| ink-mute | `#6f6580` | secondary/meta |
| hairline cream | `#e8e2d4` | dividers on paper |
| hairline purple | `#3a2b52` | dividers on purple art |

## Images

Every `<img>` needs: `width`, `height`, `alt`, `style="display:block;"`, and **styled
alt** (inline `font-family`, `font-size`, `color`, and `background-color` matching its
panel) so the images-blocked state reads as designed text, not a broken box.

Baked art lives in `assets/email-art/`. **Renaming rule: if you re-render a PNG, give it
a new filename** (bump the number). GitHub Pages caches images by URL forever.

Art sources are HTML, rendered with headless Chrome:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-first-run --hide-scrollbars --window-size=1200,520 \
  --screenshot=OUT.png --virtual-time-budget=8000 file://SRC.html
```
`assets/email-art/event-hero.html` is parameterized:
`?title=Info <em>Night.</em>&v1=Wed Sep 2&v2=7:00 PM&v3=BSN 225`

Existing event heroes (1200x520, ~34KB each):
`hero-info-night.png`, `hero-workshop.png`, `hero-alumni-panel.png`,
`hero-phi-chi-fest.png`, `hero-quick-queue.png`, `hero-invite-only.png`

Shared art: `btn-art1.png` (gold CTA on purple, 1200x190), `footer-art1.png`
(hairline + crest + wordmark, 1200x370), `footer-web1.png` / `footer-ig1.png`
(link chips, 600x130 each), `close-art3.png`, `note-art1.png`,
`num-01b.png`..`num-05b.png` (transparent italic numerals).

---

## BLOCKS

### A · Document shell
```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>SUBJECT LINE</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!--[if gte mso 9]><xml><o:OfficeDocumentSettings>
    <o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings></xml><![endif]-->
  <!--
    SUBJECT:      ...
    PREVIEW TEXT: ...
    ✎ EDIT BEFORE SENDING: (list the merge fields and links)
  -->
</head>
<body style="margin:0; padding:0; background-color:#f4f1ea; -webkit-text-size-adjust:100%;">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    PREVIEW TEXT HERE&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ea;">
    <tr><td align="center" style="padding:26px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background-color:#ffffff;">
        <!-- BLOCKS GO HERE -->
      </table>
    </td></tr>
  </table>
</body>
</html>
```

### B · Hero art
```html
<tr>
  <td bgcolor="#241733" style="background-color:#241733; padding:0;">
    <img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/hero-info-night.png"
         width="600" height="260" alt="PCT Fall Rush. Info Night. Wednesday September 2, 7:00 PM, BSN 225."
         style="display:block; width:100%; height:auto; font-family:Georgia,serif; font-size:18px; line-height:1.5; color:#faf8f3; background-color:#241733;">
  </td>
</tr>
```

### C · Primary CTA (baked, on purple)
```html
<tr>
  <td bgcolor="#241733" style="background-color:#241733; padding:0;">
    <a href="✎ LINK" style="display:block;">
      <img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/btn-art1.png"
           width="600" height="95" alt="✎ BUTTON LABEL"
           style="display:block; width:100%; height:auto; border:0; font-family:Helvetica,'Segoe UI',sans-serif; font-size:14px; font-weight:bold; color:#c9a227; background-color:#241733;">
    </a>
  </td>
</tr>
```
For a CTA **on cream**, use the live bulletproof button instead:
```html
<tr>
  <td bgcolor="#faf8f3" align="center" style="background-color:#faf8f3; padding:8px 44px 44px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr><td align="center" bgcolor="#c9a227" style="background-color:#c9a227;">
        <a href="✎ LINK" style="display:inline-block; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:14px; font-weight:700; color:#191221; text-decoration:none; padding:16px 34px;">✎ LABEL</a>
      </td></tr>
    </table>
  </td>
</tr>
```

### D · Section label (live text, editable)
Bold uppercase gold-ink. Live rather than baked so chairs can edit without re-rendering art.
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:44px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-bottom:1px solid #e8e2d4; padding-bottom:12px; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:700; color:#8a6d14; text-transform:uppercase;">✎ LABEL</td></tr>
    </table>
  </td>
</tr>
```

### E · Body paragraph
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:18px 44px 0; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:16px; font-weight:400; line-height:1.75; color:#453a52;">
    ✎ COPY
  </td>
</tr>
```

### F · Event detail card (the key new component)
Two-column rows inside a hairline box. Terms in purple caps, values in ink.
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:20px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2d4;">
      <tr>
        <td width="34%" style="padding:14px 0 14px 18px; border-bottom:1px solid #e8e2d4; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:700; color:#4b2e83; text-transform:uppercase;">Date</td>
        <td style="padding:14px 18px 14px 0; border-bottom:1px solid #e8e2d4; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:15px; color:#191221; font-weight:600;">✎ Wednesday, September 2</td>
      </tr>
      <!-- repeat for Time / Location / Attire; last row drops border-bottom -->
    </table>
  </td>
</tr>
```

### G · Callout box (one important sentence)
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:24px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2eee4;">
      <tr>
        <td width="4" bgcolor="#c9a227" style="background-color:#c9a227; font-size:0; line-height:0;">&nbsp;</td>
        <td style="padding:16px 20px; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:15px; line-height:1.65; color:#453a52;">
          <strong style="color:#191221;">✎ Lead.</strong> ✎ Sentence.
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### H · Numbered / timeline rows
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:8px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="96" valign="top" style="padding:24px 0 22px; border-bottom:1px solid #e8e2d4;">
          <img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/num-01b.png" width="80" height="60" alt="01" style="display:block; font-family:Georgia,serif; font-style:italic; font-size:20px; color:#8a6d14;">
        </td>
        <td valign="top" style="padding:26px 0 22px; border-bottom:1px solid #e8e2d4;">
          <div style="font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:16px; font-weight:700; color:#191221;">✎ Title</div>
          <div style="font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:15px; font-weight:400; line-height:1.7; color:#453a52; padding-top:6px;">✎ Copy.</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### I · Photo slot (placeholder the chair swaps)
Reserve the space with width/height so nothing reflows when it loads.
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:26px 44px 0;">
    <img src="https://chasebarn.github.io/pct-zeta-rho/assets/photo-letters.jpg"
         width="512" height="512" alt="✎ Describe the photo"
         style="display:block; width:100%; max-width:512px; height:auto; border:1px solid #e8e2d4;">
    <div style="font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; color:#6f6580; padding-top:8px;">✎ Caption</div>
  </td>
</tr>
```

### J · Divider
```html
<tr><td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:32px 44px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="border-top:1px solid #e8e2d4; font-size:0; line-height:0;">&nbsp;</td>
  </tr></table>
</td></tr>
```

### K · Two-up stat / spotlight pair
Stacks on narrow clients because each cell is a full-width table at 100%.
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:24px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" valign="top" style="padding-right:12px;">
          <div style="font-family:'Instrument Serif',Georgia,serif; font-size:38px; line-height:1; color:#191221;">✎ 95%</div>
          <div style="font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:700; color:#8a6d14; text-transform:uppercase; padding-top:8px;">✎ Label</div>
        </td>
        <td width="50%" valign="top" style="padding-left:12px;">
          <div style="font-family:'Instrument Serif',Georgia,serif; font-size:38px; line-height:1; color:#191221;">✎ 3.60</div>
          <div style="font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:700; color:#8a6d14; text-transform:uppercase; padding-top:8px;">✎ Label</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### L · Closing art + footer (always the last three blocks)
```html
<tr>
  <td bgcolor="#241733" style="background-color:#241733; padding:0;">
    <img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/close-art3.png" width="600" height="220"
         alt="✎ Closing line" style="display:block; width:100%; height:auto; font-family:Georgia,serif; font-size:18px; line-height:1.5; color:#faf8f3; background-color:#241733;">
  </td>
</tr>
<tr>
  <td bgcolor="#241733" style="background-color:#241733; padding:0;">
    <img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/footer-art1.png" width="600" height="185"
         alt="Phi Chi Theta at USF" style="display:block; width:100%; height:auto; font-family:Georgia,serif; font-size:16px; color:#faf8f3; background-color:#241733;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="50%" style="padding:0;"><a href="https://chasebarn.github.io/pct-zeta-rho/" style="display:block;"><img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/footer-web1.png" width="300" height="65" alt="Visit our website" style="display:block; width:100%; height:auto; border:0; font-family:Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:bold; color:#faf8f3; background-color:#241733;"></a></td>
      <td width="50%" style="padding:0;"><a href="https://www.instagram.com/pctusf/" style="display:block;"><img src="https://chasebarn.github.io/pct-zeta-rho/assets/email-art/footer-ig1.png" width="300" height="65" alt="@pctusf on Instagram" style="display:block; width:100%; height:auto; border:0; font-family:Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:bold; color:#faf8f3; background-color:#241733;"></a></td>
    </tr></table>
  </td>
</tr>
```


---

## HARD RULES ADDED AFTER THE FIRST BUILD FAILED REVIEW

These are not suggestions. The first pass was rejected for exactly these.

### R1 · NEVER put a ✎ in visible copy
The pencil is for HTML COMMENTS ONLY: `<!-- EDIT: swap the date -->`.
A ✎ inside a `<td>`, `<div>`, `<span>`, or any text node renders as a literal
pencil character to the reader. The alumni template shipped 34 of them and looked
broken. Visible placeholders use BRACKETED CAPS instead: `[FIRST LAST]`,
`[CLASS OF 20XX]`, `[ROLE] at [COMPANY]`, `[$0,000]`. Those read as intentional
mock content. Pencils read as a bug.

### R2 · Placeholder images are BOXES, not photos
Do not reference assets/photo-*.jpg. Those are three specific photos of unrelated
events, and dropping them in reads as random stock. Use this block, which needs no
image file and renders identically everywhere:
```html
<tr>
  <td bgcolor="#faf8f3" style="background-color:#faf8f3; padding:26px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#efe9dc;">
      <tr><td align="center" style="padding:64px 20px; font-family:'Inter','Helvetica Neue',Helvetica,'Segoe UI',sans-serif; font-size:12px; font-weight:700; color:#6e6552; text-transform:uppercase;">
        Image placeholder
      </td></tr>
    </table>
  </td>
</tr>
```
Two side by side: same thing in a 2-column table, each `width="50%"`, inner cell
padding `44px 12px`.

### R3 · COPY LIMITS. These are counted.
- Event reminder emails: **90 words of body copy, maximum**, excluding the detail
  card. One short intro (2 sentences max). "What to expect" is **3 rows, one line
  each**, not paragraphs.
- Confirmation: 60 words plus the schedule list.
- Follow up: 70 words.
- Newsletter / support: each section is 2 sentences max.
If a sentence is not carrying the date, the room, the attire, or the action, cut it.

### R4 · Do not give advice, and do not explain things nobody asked
Banned: "bring a question", "write your questions down beforehand", "come prepared
to", "make sure you", "here is a tip", dues or cost information in a rush reminder,
explanations of what a fraternity is, anything that reads as coaching. State the
facts of the event. The reader decides what to do with them.

### R5 · Dark mode must not break the cream panel
Every `<td>` that sets `background-color:#faf8f3` must also carry `bgcolor="#faf8f3"`
as an attribute, and every text `<div>` inside it must set an explicit `color:`.
Never rely on an inherited colour. A client that inverts the panel will still find
an explicit colour on the text, so the pairing stays legible instead of going
dark-on-dark.

### R6 · One idea per band
Hero, then one thing, then the next. Do not stack a paragraph plus a callout plus a
list plus a photo in a single cream run. Whitespace is the design.

---

## Fall Rush 2026 event data

| # | Event | Date | Time | Location | Attire | Hero art |
|---|---|---|---|---|---|---|
| 1 | Info Night | Wed, Sep 2 | 7:00 PM | BSN 225 | Business professional | `hero-info-night.png` |
| 2 | Professional Workshop | Fri, Sep 4 | 7:00 PM | BSN 225 | Business casual | `hero-workshop.png` |
| 3 | Alumni Panel | Wed, Sep 9 | 7:00 PM | BSN 225 | Business professional | `hero-alumni-panel.png` |
| 4 | Phi Chi Fest | Fri, Sep 11 | 7:00 PM | BSN 225 | Casual | `hero-phi-chi-fest.png` |
| 5 | Quick Queue | Wed, Sep 16 | 7:00 PM | MSC 2709 | Business casual | `hero-quick-queue.png` |
| 6 | Invite Only | Fri, Sep 18 | 7:00 PM | Shared with invitees | Announced with invitation | `hero-invite-only.png` |

⚠️ The source flyer is labelled **FALL RUSH 2025** and those dates fall on Tue/Thu in 2025
but Wed/Fri in 2026. Everything shipped uses **2026 (Wed/Fri)**, matching the confirmed
"Wednesday, September 2". **Confirm the year and weekdays before any real send.**
