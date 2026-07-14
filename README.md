# Phi Chi Theta — Zeta Rho Chapter Website

Static site for PCT Zeta Rho at the University of South Florida. No build step,
no frameworks — plain HTML/CSS/JS. If you can edit a text file, you can maintain this.

## Structure

```
index.html          Home
rush.html           Rush
philanthropy.html   Philanthropy
apparel.html        Apparel
css/styles.css      All styling (design tokens at the top in :root)
js/main.js          All interactions (each feature is a labeled block)
assets/             Photos + crest
```

## Things you'll actually need to change

| What | Where |
|---|---|
| **Rush countdown date** | Search `data-countdown` in `index.html` and `rush.html` — one ISO date string on each page |
| **Interest form link** | Search `sites.google.com` — replace with the direct Google Form URL |
| **Stats / copy** | Directly in the HTML — text is where you'd expect it |
| **Placement companies** | The two `.placerow` lines in `index.html` |
| **Apparel products/prices** | `apparel.html`, product cards |
| **Photos** | Drop new images in `assets/`, update the `<img src>` paths |

## After ANY edit to styles.css or main.js

Bump the cache version on **all four** HTML pages so visitors get the new files:

```bash
# example: v=14 -> v=15
sed -i '' 's/?v=14/?v=15/g' index.html rush.html philanthropy.html apparel.html
```

(Editing HTML only? No bump needed.)

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

The site is hosted on GitHub Pages. Deploying = pushing to `main`:

```bash
git add -A
git commit -m "describe your change"
git push
```

Live in ~1 minute.

## IT Chair handoff checklist

1. New chair creates a github.com account (their own, personal).
2. Outgoing chair (or any org owner): GitHub org → **People → Invite** new chair as **Owner**.
3. Remove graduated members from the org.
4. Hand over access to: the chapter Google account (owns the Forms + old Google Site),
   the Printful store login, and the domain registrar login if a custom domain was added.
5. The org's recovery email should always be the chapter email — never a personal one.

## Accounts that own things

| Service | Purpose | Owner should be |
|---|---|---|
| GitHub org | This repo + hosting | Chapter (chairs added/removed as people) |
| Google (chapter account) | Interest form, Drive | Chapter email |
| Printful | Apparel store | Chapter email |
| Domain registrar | Custom domain (optional) | Chapter email |
