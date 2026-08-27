#!/usr/bin/env python3
"""Assemble v2/parts/*.{html,css,js} into v2/index.html.
Order is fixed by the leading number in each filename."""
import glob, os, re, sys

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
    # parts are authored with repo-root-relative asset paths; the page lives in /v2/
    h = re.sub(r'(src|href)="assets/', r'\1="../assets/', h)
    html.append(f'\n    <!-- ===== {slug} ===== -->\n' + h)
    c = read(stem + '.css')
    if c:
        c = c.replace('url(assets/', 'url(../assets/').replace('url("assets/', 'url("../assets/')
        css.append(f'/* ===== {slug} ===== */\n' + c)
    j = read(stem + '.js')
    if j:
        j = j.replace("'assets/", "'../assets/").replace('"assets/', '"../assets/')
        js.append(f'/* ===== {slug} ===== */\n' + j)

# section 05 defines window.pctMotion and must be evaluated first
js.sort(key=lambda s: 0 if 'pctMotion' in s[:400] else 1)
inits = re.findall(r'window\.(pctInit\w+)\s*=', '\n'.join(js))

doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phi Chi Theta at USF — Professional Business Fraternity</title>
<meta name="description" content="Phi Chi Theta (Zeta Rho) is a professional business fraternity at the University of South Florida.">
<link rel="icon" type="image/png" href="../assets/crest.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<style>
{chr(10).join(css)}
</style>
</head>
<body>

  <a class="skip-link" href="#main" style="position:absolute;left:-9999px">Skip to content</a>

  <main id="main">
{chr(10).join(html)}
  </main>

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
