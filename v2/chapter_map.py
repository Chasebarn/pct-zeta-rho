"""Build the chapter map from sourced geographic and campus data, without runtime dependencies."""
import json
import math
from collections import Counter, defaultdict
from html import escape
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / 'assets' / 'map'
CHAPTER_DATA = json.loads((DATA / 'chapters.json').read_text())
CHAPTERS = CHAPTER_DATA['chapters']
STATES = json.loads((DATA / 'states.geojson').read_text())['features']

# Continental U.S. Albers equal-area projection. Geographic boundaries and campus
# points share the exact same projection and fit; no pin locations are hand drawn.
RAD = math.pi / 180
N = (math.sin(29.5 * RAD) + math.sin(45.5 * RAD)) / 2
C = math.cos(29.5 * RAD) ** 2 + 2 * N * math.sin(29.5 * RAD)
RHO0 = math.sqrt(C - 2 * N * math.sin(37.5 * RAD)) / N


def albers(point):
    lon, lat = point
    theta = N * (lon + 96) * RAD
    rho = math.sqrt(C - 2 * N * math.sin(lat * RAD)) / N
    return rho * math.sin(theta), -(RHO0 - rho * math.cos(theta))


def polygons(feature):
    geometry = feature['geometry']
    return geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]


ALL_POINTS = [albers(p) for f in STATES for poly in polygons(f) for ring in poly for p in ring]
MIN_X = min(p[0] for p in ALL_POINTS)
MAX_X = max(p[0] for p in ALL_POINTS)
MIN_Y = min(p[1] for p in ALL_POINTS)
MAX_Y = max(p[1] for p in ALL_POINTS)
SCALE = min(912 / (MAX_X - MIN_X), 552 / (MAX_Y - MIN_Y))
DX = (960 - (MAX_X - MIN_X) * SCALE) / 2
DY = (600 - (MAX_Y - MIN_Y) * SCALE) / 2


def project(point):
    x, y = albers(point)
    return (x - MIN_X) * SCALE + DX, (y - MIN_Y) * SCALE + DY


def simplify(points, tolerance=.45):
    if len(points) < 3:
        return points
    x1, y1 = points[0]
    x2, y2 = points[-1]
    dx, dy = x2 - x1, y2 - y1
    length = dx * dx + dy * dy
    farthest, distance = 0, 0
    for i, (x, y) in enumerate(points[1:-1], 1):
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / length)) if length else 0
        d = (x - x1 - t * dx) ** 2 + (y - y1 - t * dy) ** 2
        if d > distance:
            farthest, distance = i, d
    if distance > tolerance * tolerance:
        return simplify(points[:farthest + 1], tolerance)[:-1] + simplify(points[farthest:], tolerance)
    return [points[0], points[-1]]


def path(ring):
    points = simplify([project(p) for p in ring])
    if len(points) < 3:
        return ''
    return 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in points) + 'Z'


def coast_rings():
    # Cancel the exact shared state segments to produce an actual U.S. outline,
    # rather than making internal state borders as strong as the coastline.
    edges = Counter()
    for feature in STATES:
        for poly in polygons(feature):
            for ring in poly:
                for a, b in zip(ring, ring[1:]):
                    a, b = tuple(a), tuple(b)
                    if a != b:
                        edges[tuple(sorted((a, b)))] += 1
    remaining = {e for e, count in edges.items() if count == 1}
    adjacent = defaultdict(set)
    for a, b in remaining:
        adjacent[a].add(b)
        adjacent[b].add(a)
    rings = []
    while remaining:
        start, current = min(remaining)
        ring = [start, current]
        remaining.remove(tuple(sorted((start, current))))
        while current != start:
            candidates = sorted(p for p in adjacent[current] if tuple(sorted((current, p))) in remaining)
            if not candidates:
                break
            next_point = candidates[0]
            remaining.remove(tuple(sorted((current, next_point))))
            ring.append(next_point)
            current = next_point
        if len(ring) > 3 and ring[-1] == ring[0]:
            rings.append(ring)
    return rings


def render_svg():
    count = len(CHAPTERS)
    lines = [f'<svg class="v2nat-map" viewBox="0 0 960 600" role="img" aria-labelledby="pct-map-title pct-map-desc" data-chapter-map>',
             '<title id="pct-map-title">Phi Chi Theta collegiate chapters across the United States</title>',
             f'<desc id="pct-map-desc">{count} collegiate campuses from the national chapter directory. Gold pins identify the campuses, with University of South Florida in Tampa highlighted.</desc>',
             '<g class="v2nat-states" aria-hidden="true">']
    for feature in STATES:
        d = ''.join(path(ring) for poly in polygons(feature) for ring in poly)
        lines.append(f'<path d="{d}"/>')
    outline = ''.join(path(ring) for ring in coast_rings())
    lines.extend(['</g>', f'<path class="v2nat-coast" d="{outline}" aria-hidden="true"/>', '<g class="v2nat-pins">'])
    for school in sorted(CHAPTERS, key=lambda c: bool(c.get('featured'))):
        x, y = project((school['lon'], school['lat']))
        featured = bool(school.get('featured'))
        classes = 'v2nat-pin' + (' is-usf is-selected' if featured else '')
        attrs = {'data-chapter-pin': school['id'], 'data-school': school['school'],
                 'data-city': school['city'], 'data-state': school['state'], 'data-chapter': school['chapter']}
        attrs = ' '.join(f'{key}="{escape(str(value), quote=True)}"' for key, value in attrs.items())
        title = escape(f"{school['school']} · {school['chapter']} · {school['city']}, {school['state']}")
        lines.append(f'<g class="{classes}" transform="translate({x:.1f} {y:.1f})" {attrs}><title>{title}</title><circle class="v2nat-pin-hit" r="16"/><circle class="v2nat-pin-ring" r="11"/><circle class="v2nat-pin-dot" r="4"/></g>')
        if featured:
            lines.append(f'<text class="v2nat-usf-label" x="{x + 15:.1f}" y="{y + 6:.1f}" aria-hidden="true">USF</text>')
    lines.extend(['</g>', '</svg>'])
    return '\n'.join(lines)


def render_options():
    return '\n'.join(f'<option value="{escape(c["id"], quote=True)}"' + (' selected' if c.get('featured') else '') + f'>{escape(c["school"])}</option>' for c in sorted(CHAPTERS, key=lambda c: c['school'].casefold()))
