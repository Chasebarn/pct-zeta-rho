#!/usr/bin/env python3
"""Build the original homepage and the shared static pages for Vercel."""
from html import escape
from pathlib import Path
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
shutil.copy2(ROOT / "site/site.js", OUTPUT / "site.js")
for page in ("about", "rush"):
    shutil.copy2(ROOT / f"site/{page}.css", OUTPUT / f"{page}.css")
original = (ROOT / "v2/index.html").read_text()
home_style = re.search(r"<style>(.*?)</style>", original, re.S)[1]
home_main = re.search(r'<main id="main">(.*?)</main>', original, re.S)[1]
home_js = re.search(r"<script>(.*?)</script>", original, re.S)[1]
footer = re.search(r'(<footer\b.*?</footer>)', original, re.S)[1]
for original_link, public_link in {
    "index.html": "/", "index.html#life": "/#life", "index.html#national": "/about",
    "rush.html": "/rush", "../portal.html": "/about#contact",
    "privacy.html": "/privacy",
}.items():
    footer = footer.replace(f'href="{original_link}"', f'href="{public_link}"')
footer = footer.replace("../assets/", "/assets/")

titles = {
    "home": ("Phi Chi Theta at USF", "Zeta Rho is USF’s professional business fraternity. Explore the chapter, member outcomes, and the Rush process."),
    "rush": ("Rush Phi Chi Theta", "Thinking about joining Phi Chi Theta at USF? Find out what happens at Rush and sign up for the next schedule."),
    "about": ("About Zeta Rho", "The story of Phi Chi Theta at USF, from its founding by 18 students to the chapter leading it today."),
    "privacy": ("Interest Form Privacy", "How Phi Chi Theta Zeta Rho uses and stores details submitted through its Rush interest form."),
}

def header(active):
    destinations = (("home", "/", "Home"), ("about", "/about", "About"))
    def link(item, *, desktop=False):
        key, href, label = item
        current = ' aria-current="page"' if key == active else ''
        css = ' class="v2hd-link"' if desktop else ''
        return f'<a{css} href="{href}"{current}>{label}</a>'
    links = "".join(f"<li>{link(item, desktop=True)}</li>" for item in destinations)
    mobile = "".join(link(item) for item in (*destinations, ("rush", "/rush", "Rush")))
    action, action_label = ("#interest", "Interest form") if active == "rush" else ("/rush", "Rush PCT")
    header_class = "v2hd is-over-hero" if active == "home" else "v2hd"
    return f'''<header class="{header_class}">
      <div class="v2wrap v2hd-row">
        <a class="v2hd-brand" href="/"><img class="v2hd-crest" src="/assets/crest.png" alt="" width="337" height="445"><span class="v2hd-lock"><span class="v2hd-name">Phi Chi Theta</span><span class="v2hd-sub">Zeta Rho · USF</span></span></a>
        <nav class="v2hd-nav" aria-label="Primary"><ul class="v2hd-list">{links}</ul></nav>
        <a class="v2hd-rush" href="{action}">{action_label}</a>
        <details class="v2hd-menu"><summary><span class="v2-sr-only">Navigation menu</span><span class="menu-bars" aria-hidden="true"></span></summary><nav class="v2hd-mobile" aria-label="Mobile navigation">{mobile}</nav></details>
      </div>
    </header>'''

def render(key, body, scripts=""):
    title, description = titles[key]
    path = "/" if key == "home" else "/" + key
    origin = os.environ.get("SITE_URL", "").rstrip("/") or "https://pct-zeta-rho.vercel.app"
    canonical = f'<link rel="canonical" href="{escape(origin + path, quote=True)}">' if origin else ""
    if origin:
        public_url = escape(origin + path, quote=True)
        share_images = {
            "rush": ("chapter-session", "Phi Chi Theta members gathered for a professional event"),
            "about": ("zeta-rho-gathering", "Zeta Rho members together on a beach at dusk"),
        }
        image, image_alt = share_images.get(key, ("chapter-gathering", "Zeta Rho members at a chapter event"))
        photo = f"{escape(origin, quote=True)}/assets/chapter/{image}-share.jpg"
        canonical += f'<meta property="og:url" content="{public_url}"><meta property="og:image" content="{photo}">'
        canonical += f'<meta property="og:image:alt" content="{escape(image_alt, quote=True)}">'
        canonical += '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
    section_styles = f"<style>{home_style}</style>" if key == "home" else '<link rel="stylesheet" href="/v2/site-frame.css">'
    page_styles = f'<link rel="stylesheet" href="/{key}.css">' if key in ("about", "rush") else ""
    source = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#241733">
<title>{escape(title)} · Zeta Rho · USF</title><meta name="description" content="{escape(description, quote=True)}">
<meta property="og:title" content="{escape(title, quote=True)} · Zeta Rho · USF"><meta property="og:description" content="{escape(description, quote=True)}">
<meta property="og:type" content="website">{canonical}
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/css/styles.css"><link rel="stylesheet" href="/v2/tokens.css">
{section_styles}<link rel="stylesheet" href="/site.css">{page_styles}
<noscript><style>.home-page .v2hd.is-over-hero {{ background: var(--purple-deep); }}</style></noscript>
</head><body class="{key}-page">
<a class="skip-link" href="#main">Skip to content</a>{header(key)}
<main id="main">{body}</main>{footer}
{scripts}<script type="module" src="/site.js"></script>
</body></html>'''
    source = source.replace("../assets/", "/assets/").replace('href="rush.html"', 'href="/rush"')
    source = source.replace('href="../philanthropy.html"', 'href="/philanthropy"')
    (OUTPUT / ("index.html" if key == "home" else key + ".html")).write_text(source)

render("home", home_main, f"<script>{home_js}</script>")
for key in ("rush", "about", "privacy"):
    render(key, (ROOT / "site/pages" / (key + ".html")).read_text())
(OUTPUT / "404.html").write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found · Phi Chi Theta</title><body style="margin:0;padding:12vh 8vw;background:#f8f6ef;color:#241733;font:20px/1.6 Georgia,serif"><h1>Page not found.</h1><p>Explore Phi Chi Theta at USF from the homepage.</p><a href="/">Return home</a></body></html>''')
(OUTPUT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /api/\n")
if os.environ.get("SITE_URL"):
    from xml.sax.saxutils import escape as xml_escape
    urls = "".join(f"<url><loc>{xml_escape(origin.rstrip('/') + ('/' if key == 'home' else '/' + key))}</loc></url>" for key in titles for origin in [os.environ["SITE_URL"]])
    (OUTPUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>')
print("Built Home, Rush, About, Privacy, and 404 in dist/")
