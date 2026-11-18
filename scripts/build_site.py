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
footer = footer.replace('href="index.html"', 'href="/"').replace('href="rush.html"', 'href="/rush"')
footer = footer.replace('href="../philanthropy.html"', 'href="/philanthropy"')
footer = footer.replace('href="../career.html"', 'href="https://www.usf.edu/business/talent-development/internships-find.aspx"')
footer = footer.replace('>Career Navigator<', '>USF career resources<')
footer = footer.replace('<li><a href="/philanthropy">Philanthropy</a></li>', '<li><a href="/about">About</a></li><li><a href="/philanthropy">Service</a></li>')
footer = footer.replace('<a href="../portal.html">Officer Portal</a>', '<a href="/about#contact">Contact the chapter</a>')
footer = footer.replace("../assets/", "/assets/")

titles = {
    "home": ("Phi Chi Theta at USF", "Zeta Rho is USF’s professional business fraternity. Explore the chapter, member outcomes, and the Rush process."),
    "rush": ("Rush Phi Chi Theta", "Rush Phi Chi Theta at the University of South Florida. Eligibility, events, attire, answers, and the chapter interest form."),
    "about": ("About Zeta Rho", "Meet USF’s Phi Chi Theta chapter. Explore Zeta Rho’s history, leadership, national network, and member recognition."),
    "philanthropy": ("Chapter Service", "See Phi Chi Theta Zeta Rho’s campus fundraising and community volunteer projects."),
    "privacy": ("Interest Form Privacy", "How Phi Chi Theta Zeta Rho uses and stores details submitted through its Rush interest form."),
}

def header(active):
    destinations = (("home", "/", "Home"), ("about", "/about", "About"), ("philanthropy", "/philanthropy", "Service"))
    def link(item, *, desktop=False):
        key, href, label = item
        current = ' aria-current="page"' if key == active else ''
        css = ' class="v2hd-link"' if desktop else ''
        return f'<a{css} href="{href}"{current}>{label}</a>'
    links = "".join(f"<li>{link(item, desktop=True)}</li>" for item in destinations)
    mobile = "".join(link(item) for item in (*destinations, ("rush", "/rush", "Rush")))
    action, action_label = ("#interest", "Rush updates") if active == "rush" else ("/rush", "Rush PCT")
    return f'''<header class="v2hd">
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
    origin = os.environ.get("SITE_URL", "").rstrip("/")
    canonical = f'<link rel="canonical" href="{escape(origin + path, quote=True)}">' if origin else ""
    if origin:
        public_url = escape(origin + path, quote=True)
        share_images = {"rush": "meet-the-chapter", "philanthropy": "community-food-pantry"}
        photo = f"chapter/{share_images.get(key, 'chapter-gathering')}-share.jpg"
        canonical += f'<meta property="og:url" content="{public_url}"><meta property="og:image" content="{escape(origin)}/assets/{photo}"><meta name="twitter:card" content="summary_large_image">'
    section_styles = f"<style>{home_style}</style>" if key == "home" else '<link rel="stylesheet" href="/v2/site-frame.css">'
    page_styles = f'<link rel="stylesheet" href="/{key}.css">' if key in ("about", "rush") else ""
    source = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#241733">
<title>{escape(title)} · Zeta Rho · USF</title><meta name="description" content="{escape(description, quote=True)}">
<meta property="og:title" content="{escape(title, quote=True)} · Zeta Rho · USF"><meta property="og:description" content="{escape(description, quote=True)}">
<meta property="og:type" content="website">{canonical}
<link rel="icon" type="image/png" href="/assets/crest.png">
<link rel="preload" href="/assets/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/css/styles.css"><link rel="stylesheet" href="/v2/tokens.css">
{section_styles}<link rel="stylesheet" href="/site.css">{page_styles}
</head><body class="{key}-page">
<a class="skip-link" href="#main">Skip to content</a>{header(key)}
<main id="main">{body}</main>{footer}
{scripts}<script type="module" src="/site.js"></script>
</body></html>'''
    source = source.replace("../assets/", "/assets/").replace('href="rush.html"', 'href="/rush"')
    source = source.replace('href="../philanthropy.html"', 'href="/philanthropy"')
    (OUTPUT / ("index.html" if key == "home" else key + ".html")).write_text(source)

render("home", home_main, f"<script>{home_js}</script>")
for key in ("rush", "about", "philanthropy", "privacy"):
    render(key, (ROOT / "site/pages" / (key + ".html")).read_text())
(OUTPUT / "404.html").write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found · Phi Chi Theta</title><body style="margin:0;padding:12vh 8vw;background:#f8f6ef;color:#241733;font:20px/1.6 Georgia,serif"><h1>Page not found.</h1><p>Explore Phi Chi Theta at USF from the homepage.</p><a href="/">Return home</a></body></html>''')
(OUTPUT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /api/\n")
if os.environ.get("SITE_URL"):
    from xml.sax.saxutils import escape as xml_escape
    urls = "".join(f"<url><loc>{xml_escape(origin.rstrip('/') + ('/' if key == 'home' else '/' + key))}</loc></url>" for key in titles for origin in [os.environ["SITE_URL"]])
    (OUTPUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>')
print("Built Home, Rush, About, Service, Privacy, and 404 in dist/")
