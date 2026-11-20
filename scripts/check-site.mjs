import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';

const verification = spawnSync('python3', ['-c', String.raw`
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
root=Path('dist')
class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.refs=[]; self.h1=0; self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='a' and 'href' in a:self.refs.append(a['href'])
        if tag in ('img','script') and a.get('src'):self.refs.append(a['src'])
        if tag in ('img','source') and a.get('srcset'):
            for candidate in a['srcset'].split(','):
                self.refs.append(candidate.strip().split()[0])
        if tag=='meta' and a.get('property')=='og:image':
            self.refs.append(urlsplit(a['content']).path)
        if tag=='link' and a.get('rel') in ('stylesheet','icon','apple-touch-icon'):self.refs.append(a['href'])
        if tag=='img':self.images.append(a)
documents={}
for path in root.rglob('*.html'):
    route=path.relative_to(root)
    if path.stem=='404' or route.parts[0]=='assets':continue
    doc=Document();doc.feed(path.read_text());documents[route]=doc
    assert doc.h1==1, f'{path}: expected one H1'
    assert len(doc.ids)==len(set(doc.ids)), f'{path}: duplicate IDs'
    assert all('alt' in image for image in doc.images), f'{path}: image missing alt'
    assert 'http://s"' not in path.read_text() and 'http://d"' not in path.read_text(),f'{path}: placeholder link'
for key,doc in documents.items():
    for href in doc.refs:
        url=urlsplit(href)
        if url.scheme or url.netloc:continue
        route=unquote(url.path)
        if route.startswith('/api/'):continue
        path=root / route.lstrip('/') if route else root / key
        if path==root:path=root/'index.html'
        if not path.suffix:path=path.with_suffix('.html')
        assert path.is_file(),f'{key}: missing {href}'
        target=documents.get(path.relative_to(root))
        if url.fragment and target:
            assert unquote(url.fragment) in target.ids,f'{key}: missing anchor {href}'
print(f'Validated {len(documents)} pages, links, IDs, headings, image labels, responsive images and share images.')
`], {stdio:'inherit'});
if (verification.status !== 0) process.exit(verification.status || 1);
const config = JSON.parse(await readFile('vercel.json','utf8'));
if (config.outputDirectory !== 'dist') throw new Error('Unexpected Vercel output directory');
for (const script of ['site/site.js','site/about.js','site/about-history.js','site/rush.js','api/interest.js','api/health.js','scripts/dev.mjs']) {
  const result = spawnSync(process.execPath,['--check',script],{stdio:'inherit'});
  if(result.status !== 0) process.exit(result.status || 1);
}
console.log('Vercel configuration and server/browser JavaScript checks passed.');
