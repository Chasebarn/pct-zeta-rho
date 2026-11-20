#!/usr/bin/env python3
"""Build the original homepage and the shared static pages for Vercel."""
from html import escape
from pathlib import Path
from urllib.parse import quote
import os
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "dist"
subprocess.run([sys.executable, str(ROOT / "v2/build.py")], check=True, env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir()

for directory in ("assets", "css"):
    shutil.copytree(ROOT / directory, OUTPUT / directory)
for icon in ("favicon.ico", "apple-touch-icon.png"):
    shutil.copy2(ROOT / "assets" / icon, OUTPUT / icon)
(OUTPUT / "v2").mkdir()
shutil.copy2(ROOT / "v2/tokens.css", OUTPUT / "v2/tokens.css")
shutil.copy2(ROOT / "v2/site-frame.css", OUTPUT / "v2/site-frame.css")
shutil.copy2(ROOT / "site/site.css", OUTPUT / "site.css")
for module in ("site", "about", "about-history"):
    shutil.copy2(ROOT / f"site/{module}.js", OUTPUT / f"{module}.js")
for page in ("about", "rush"):
    shutil.copy2(ROOT / f"site/{page}.css", OUTPUT / f"{page}.css")
original = (ROOT / "v2/index.html").read_text()
home_style = re.search(r"<style>(.*?)</style>", original, re.S)[1]
home_main = re.search(r'<main id="main">(.*?)</main>', original, re.S)[1]
home_js = re.search(r"<script>(.*?)</script>", original, re.S)[1]
footer = re.search(r'(<footer\b.*?</footer>)', original, re.S)[1]
for original_link, public_link in {
    "index.html": "/", "index.html#life": "/#life", "index.html#national": "/about",
    "index.html#placements": "/#placements",
    "rush.html": "/rush", "../portal.html": "/about#contact",
    "privacy.html": "/privacy",
}.items():
    footer = footer.replace(f'href="{original_link}"', f'href="{public_link}"')
footer = footer.replace("../assets/", "/assets/")

titles = {
    "home": ("Phi Chi Theta at USF · Zeta Rho", "Zeta Rho is USF’s professional business fraternity. Explore the chapter, member outcomes, and the Rush process."),
    "rush": ("Rush Phi Chi Theta at USF", "See who can Rush, what happens at recruitment events, and how to get updates from Phi Chi Theta at USF."),
    "interest": ("Rush Interest Form · Phi Chi Theta at USF", "Leave your details to hear from Zeta Rho about the next round of recruitment at USF."),
    "about": ("About Zeta Rho · Phi Chi Theta at USF", "Explore Zeta Rho’s history, service in Tampa Bay, Fall Summit, Muma 25 Under 25 honorees, and chapter leadership."),
    "privacy": ("Interest Form Privacy · Phi Chi Theta at USF", "How Phi Chi Theta Zeta Rho uses and stores details submitted through its Rush interest form."),
}
routes = {"home": "/", "interest": "/rush/interest"}

def header(active):
    destinations = (("home", "/", "Home"), ("about", "/about", "About"), ("rush", "/rush", "Rush"))
    def link(item, *, primary=False):
        key, href, label = item
        current = ' aria-current="page"' if key == active else ''
        classes = ["v2hd-link"] if primary else []
        if key == "rush":
            classes.append("v2hd-rush")
        css = f' class="{" ".join(classes)}"' if classes else ""
        return f'<a{css} href="{href}"{current}>{label}</a>'
    links = "".join(f"<li>{link(item, primary=True)}</li>" for item in destinations)
    mobile = "".join(link(item) for item in destinations if item[0] != "rush")
    header_class = "v2hd is-over-hero" if active == "home" else "v2hd"
    if active in ("home", "rush", "about", "interest"):
        header_class += " is-hero-nav"
    return f'''<header class="{header_class}">
      <div class="v2wrap v2hd-row">
        <a class="v2hd-brand" href="/"><img class="v2hd-crest" src="/assets/crest.png" alt="" width="337" height="445"><span class="v2hd-lock"><span class="v2hd-name">Phi Chi Theta</span><span class="v2hd-sub">Zeta Rho · USF</span></span></a>
        <nav class="v2hd-nav" aria-label="Primary"><ul class="v2hd-list">{links}</ul></nav>
        <details class="v2hd-menu"><summary><span class="v2-sr-only">Navigation menu</span><span class="menu-bars" aria-hidden="true"></span></summary><nav class="v2hd-mobile" aria-label="Mobile navigation">{mobile}</nav></details>
      </div>
    </header>'''

def render(key, body, scripts=""):
    title, description = titles[key]
    path = routes.get(key, "/" + key)
    origin = os.environ.get("SITE_URL", "").rstrip("/") or "https://pct-zeta-rho.vercel.app"
    canonical = f'<link rel="canonical" href="{escape(origin + path, quote=True)}">' if origin else ""
    if origin:
        public_url = escape(origin + path, quote=True)
        share_images = {
            "rush": ("rush-members", "Phi Chi Theta members in white Rush shirts outside a campus building"),
            "interest": ("rush-members", "Phi Chi Theta members in white Rush shirts outside a campus building"),
            "about": ("chapter-speaker-audience", "A Zeta Rho student and a guest speaker stand in front of chapter members"),
        }
        image, image_alt = share_images.get(key, ("chapter-gathering", "Zeta Rho members at a chapter event"))
        photo = f"{escape(origin, quote=True)}/assets/chapter/{image}-share.jpg"
        canonical += f'<meta property="og:url" content="{public_url}"><meta property="og:image" content="{photo}">'
        canonical += f'<meta property="og:image:alt" content="{escape(image_alt, quote=True)}">'
        canonical += '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
    section_styles = f"<style>{home_style}</style>" if key == "home" else '<link rel="stylesheet" href="/v2/site-frame.css">'
    stylesheet = {"about": "about", "rush": "rush", "interest": "rush"}.get(key)
    page_styles = f'<link rel="stylesheet" href="/{stylesheet}.css">' if stylesheet else ""
    page_footer = (ROOT / "site/about-footer.html").read_text() if key == "about" else footer
    if key == "rush":
        share = f'''<div class="rush-footer-share">
          <button class="button-secondary" type="button" data-share>Share with a friend</button>
          <p data-share-status role="status" aria-live="polite"></p>
          <noscript>
            <style>.rush-footer-share button {{ display: none; }}</style>
            <a href="mailto:?subject=Rush%20Phi%20Chi%20Theta%20at%20USF&amp;body={quote(origin + path, safe='')}">Email the Rush page</a>
          </noscript>
        </div>'''
        page_footer = page_footer.replace('<a href="/rush">How Rush works</a>', share)
    source = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#241733">
<title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">
<meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(description, quote=True)}">
<meta property="og:type" content="website">{canonical}
<link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" href="/assets/pct-tab.png?v=3" sizes="64x64">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/css/styles.css"><link rel="stylesheet" href="/v2/tokens.css">
{section_styles}<link rel="stylesheet" href="/site.css">{page_styles}
<noscript><style>.home-page .v2hd.is-over-hero {{ background: var(--purple-deep); }}</style></noscript>
</head><body class="{key}-page">
<a class="skip-link" href="#main">Skip to content</a>{header(key)}
<main id="main">{body}</main>{page_footer}
{scripts}<script type="module" src="/site.js"></script>
</body></html>'''
    source = source.replace("../assets/", "/assets/").replace('href="rush.html"', 'href="/rush"')
    source = source.replace('href="../philanthropy.html"', 'href="/philanthropy"')
    page_file = OUTPUT / ("index.html" if key == "home" else path.lstrip("/") + ".html")
    page_file.parent.mkdir(parents=True, exist_ok=True)
    page_file.write_text(source)

render("home", home_main, f"<script>{home_js}</script>")
for key in ("rush", "interest", "about", "privacy"):
    render(key, (ROOT / "site/pages" / (key + ".html")).read_text())
(OUTPUT / "404.html").write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found · Phi Chi Theta</title><link rel="icon" type="image/png" href="/assets/pct-tab.png?v=3" sizes="64x64"><body style="margin:0;padding:12vh 8vw;background:#f8f6ef;color:#241733;font:20px/1.6 Georgia,serif"><h1>Page not found.</h1><p>Explore Phi Chi Theta at USF from the homepage.</p><a href="/">Return home</a></body></html>''')
(OUTPUT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /api/\n")
if os.environ.get("SITE_URL"):
    from xml.sax.saxutils import escape as xml_escape
    urls = "".join(f"<url><loc>{xml_escape(os.environ['SITE_URL'].rstrip('/') + routes.get(key, '/' + key))}</loc></url>" for key in titles)
    (OUTPUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>')
print("Built Home, Rush, Rush interest form, About, Privacy, and 404 in dist/")
