#!/usr/bin/env python3
"""Assemble v2/parts/*.{html,css,js} into v2/index.html.
Order is fixed by the leading number in each filename."""
import glob, os, re, sys
from chapter_map import CHAPTERS, render_svg

ROOT = os.path.dirname(os.path.abspath(__file__))
parts = sorted(glob.glob(os.path.join(ROOT, 'parts', '*.html')))
if not parts:
    sys.exit('no parts found')

def read(p):
    return open(p, encoding='utf-8').read().strip() if os.path.exists(p) else ''

names, html, css, js = [], [], [], []
for p in parts:
    stem = p[:-5]
    slug = os.path.basename(stem)
    names.append(slug)
    h = read(p)
    if slug == '04-national':
        h = h.replace('<!-- PCT_CHAPTER_MAP -->', render_svg())
        h = h.replace('{{PCT_CHAPTER_COUNT}}', str(len(CHAPTERS)))
    # parts are authored with repo-root-relative asset paths; the page lives in /v2/
    h = re.sub(r'(src|href)="assets/', r'\1="../assets/', h)
    # Prefer a V2 destination when present; retained dedicated pages live at the repo root.
    def page_href(match):
        target = match.group(1)
        page = re.split(r'[?#]', target, maxsplit=1)[0]
        if not os.path.isfile(os.path.join(ROOT, page)) and os.path.isfile(os.path.join(ROOT, '..', page)):
            return 'href="../' + target + '"'
        return match.group(0)
    h = re.sub(r'href="([a-zA-Z0-9-]+\.html(?:[?#][^\"]*)?)"', page_href, h)
    html.append(f'\n    <!-- ===== {slug} ===== -->\n' + h)
    c = read(stem + '.css')
    if c:
        c = c.replace('url(assets/', 'url(../assets/').replace('url("assets/', 'url("../assets/')
        css.append(f'/* ===== {slug} ===== */\n' + c)
    j = read(stem + '.js')
    if j:
        j = j.replace("'assets/", "'../assets/").replace('"assets/', '"../assets/')
        js.append(f'/* ===== {slug} ===== */\n' + j)

# The shared reduced-motion lifecycle must be evaluated before section inits
js.sort(key=lambda s: 0 if 'pctMotion' in s[:400] else 1)
inits = re.findall(r'window\.(pctInit\w+)\s*=', '\n'.join(js))
# The recruitment page consumes the same frame styles as the homepage.
frame_css = read(os.path.join(ROOT, 'parts', '00-header.css')) + '\n' + read(os.path.join(ROOT, 'parts', '99-footer.css'))
open(os.path.join(ROOT, 'site-frame.css'), 'w', encoding='utf-8').write(frame_css + '\n')
header_html = html[names.index('00-header')] if '00-header' in names else ''
footer_html = html[names.index('99-footer')] if '99-footer' in names else ''
main_html = '\n'.join(part for name, part in zip(names, html)
                      if name not in ('00-header', '99-footer'))

doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#241733">
<title>Phi Chi Theta at USF · Professional Business Fraternity</title>
<meta name="description" content="Phi Chi Theta (Zeta Rho) is a professional business fraternity at the University of South Florida.">
<link rel="canonical" href="https://chasebarn.github.io/pct-zeta-rho/v2/index.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Phi Chi Theta at USF">
<meta property="og:description" content="Career preparation, leadership, and a business network before you graduate.">
<meta property="og:image" content="https://chasebarn.github.io/pct-zeta-rho/assets/chapter-members.jpg">
<meta property="og:image:alt" content="Four Zeta Rho members in professional attire at a chapter event.">
<meta property="og:url" content="https://chasebarn.github.io/pct-zeta-rho/v2/index.html">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="../assets/pct-crest-official.png">
<link rel="preload" href="../assets/fonts/instrument-serif-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="tokens.css?v=20261116">
<style>
{chr(10).join(css)}
</style>
</head>
<body>

  <a class="skip-link" href="#main">Skip to content</a>

{header_html}

  <main id="main">
{main_html}
  </main>

{footer_html}

<script>
{chr(10).join(js)}

/* ---- boot: every init is optional and must never take the page down ---- */
(function () {{
  var inits = {inits!r};
  inits.forEach(function (n) {{
    try {{ if (typeof window[n] === 'function') window[n](); }}
    catch (e) {{ if (window.console) console.warn(n + ' failed:', e); }}
  }});
}})();
</script>
</body>
</html>
'''
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(doc)
print(f'assembled {len(names)} sections -> v2/index.html')
print('  order:', ', '.join(names))
print('  inits:', ', '.join(inits) if inits else '(none found)')
print('  size :', len(doc) // 1024, 'KB')
