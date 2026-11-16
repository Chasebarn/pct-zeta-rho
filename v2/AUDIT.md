# V2 audit — November 16, 2026

The review followed a prospective member from homepage to Rush. The main issues
were inherited layout defaults, motion that made content harder to read, tight
photography crops, and a signup button with a dead end.

| Finding | Resolution |
|---|---|
| The V2 build imported the legacy page's section padding, scroll offsets and reset. | V2 uses its own reset and layout tokens. Anchors clear the measured sticky header. |
| The old hero depended on a canvas, filtered grain and an oversized ornamental letter layer. | Real chapter photography and static type carry the identity. The clean national crest is from the national website. The two existing brand typefaces are served locally. |
| The membership UI opened panels on focus and manually repositioned the phone viewport. | Opening a topic is an explicit action, with a shared stable photo stage and no scroll scripting. |
| Long logo travel and partial wordmarks made the results hard to scan on a phone. | Shorter travel and whole-logo fades keep each displayed wordmark intact. Every mark still appears. |
| The prior map hid the complete layer, then scheduled 100 individual animations. | Campus pins stay visible and fixed. The local USF marker gets one brief opacity accent. The November directory and NCES coordinates are reflected in 46 campus pins. |
| Tall, always-moving portraits cropped side subjects and competed with Rush. | Wider crops, manual photo navigation, static fallbacks and a genuine overlap with the full-width Rush section preserve the arc. The flash marks in the nighttime shot belong to the original photograph. |
| The Interest Form label led to an extra page with two broken buttons. | V2 points to the chapter's official updates channel. A public sign-up form for the next cycle has not been verified. |

Layout passed at 320, 390, 600, 760, 796, 900, 1100 and 1440 CSS px in the browser.
Functionality reviewed: mobile menu, membership controls, two/three logo rows,
untouched pin coordinates, photo buttons and arrow keys, full-width Rush overlap,
reduced motion and the no-JavaScript fallback. These are browser viewport checks,
not a claim about physical devices or formal WCAG conformance.

References: [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[W3C pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html),
[web.dev animation performance](https://web.dev/articles/animations-guide),
[Phi Chi Theta official directory](https://www.phichitheta.org/find-a-chapter).
