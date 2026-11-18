import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {spawnSync} from 'node:child_process';

const built = spawnSync('python3', ['scripts/build_site.py'], {stdio: 'inherit'});
if (built.status !== 0) process.exit(built.status || 1);
const root = resolve('dist');
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const redirects = new Map(config.redirects.map(rule => [rule.source, rule]));
const mime = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.json':'application/json', '.webp':'image/webp', '.ico':'image/x-icon'};
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const redirect = redirects.get(url.pathname);
  if (redirect) {
    response.writeHead(redirect.permanent ? 308 : 307, {Location: redirect.destination});
    return response.end();
  }
  if (url.pathname === '/api/interest' || url.pathname === '/api/health') {
    try {
      const handler = (await import('../api/' + url.pathname.split('/').pop() + '.js')).default;
      response.status = code => {response.statusCode = code; return response;};
      response.json = value => {response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value));};
      await handler(request, response);
    } catch {
      response.writeHead(503, {'Content-Type':'application/json'});
      response.end(JSON.stringify({ok:false,message:'The interest form is temporarily unavailable. Please try again later.'}));
    }
    return;
  }
  try {
    const pathname = decodeURIComponent(url.pathname);
    let file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) throw new Error('Invalid path');
    if (!extname(file)) file += '.html';
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    response.end(await readFile(resolve(root,'404.html')));
  }
});
const port = Number(process.env.PORT || 8770);
server.listen(port, '127.0.0.1', () => console.log('Local site at http://127.0.0.1:' + port));
