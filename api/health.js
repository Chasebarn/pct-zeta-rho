export default async function health(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    response.end(JSON.stringify({ ready: false }));
    return;
  }

  let ready = false;
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      await sql.query('SELECT id FROM interest_signups LIMIT 0');
      ready = true;
    } catch {
      ready = false;
    }
  }
  response.statusCode = ready ? 200 : 503;
  response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ ready }));
}
