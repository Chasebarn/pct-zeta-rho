import { createHmac } from 'node:crypto';

const MAX_BODY_BYTES = 12_000;
const WINDOW_LIMIT = 120;
const WINDOW_SECONDS = 600;
const ALLOWED_SOURCES = new Set(['home', 'rush', 'about']);
const SUCCESS_MESSAGE = 'Your interest has been saved. The chapter can use these details to contact you about Rush.';

// A single statement locks the rate-limit row before deciding whether to insert.
// The unique email/season key makes simultaneous submissions and retries safe.
export const SAVE_INTEREST_SQL = `
  WITH allowance AS (
    INSERT INTO interest_request_limits (request_key, window_start, attempts)
    VALUES ($1, date_bin('10 minutes', now(), TIMESTAMPTZ '2000-01-01 00:00:00+00'), 1)
    ON CONFLICT (request_key) DO UPDATE SET
      attempts = CASE
        WHEN interest_request_limits.window_start = EXCLUDED.window_start
        THEN interest_request_limits.attempts + 1
        ELSE 1
      END,
      window_start = EXCLUDED.window_start
    RETURNING attempts
  ), saved AS (
    INSERT INTO interest_signups (
      full_name, email, major, graduation_year, source, season,
      consent_version, consent_at
    )
    SELECT $2, $3, $4, $5, $6, $7, 'rush-interest-v1', now()
    WHERE (SELECT attempts FROM allowance) <= $8
    ON CONFLICT (email, season) DO NOTHING
    RETURNING id
  )
  SELECT
    (SELECT attempts FROM allowance) > $8 AS rate_limited,
    EXISTS (SELECT 1 FROM saved) AS inserted
`;

function reply(response, status, body) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.statusCode = status;
  response.end(JSON.stringify(body));
}

function invalidRequest(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function readBody(request) {
  const contentType = String(request.headers['content-type'] || '').split(';')[0].trim();
  if (contentType !== 'application/json') {
    throw invalidRequest(415, 'Please submit the interest form from the website.');
  }
  const declaredLength = Number(request.headers['content-length']);
  if (declaredLength > MAX_BODY_BYTES) {
    throw invalidRequest(413, 'This form submission is too large.');
  }

  let body = request.body;
  if (body === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += bytes.length;
      if (size > MAX_BODY_BYTES) {
        throw invalidRequest(413, 'This form submission is too large.');
      }
      chunks.push(bytes);
    }
    body = Buffer.concat(chunks);
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
      throw invalidRequest(413, 'This form submission is too large.');
    }
    try {
      body = JSON.parse(body);
    } catch {
      throw invalidRequest(400, 'The form could not be read. Please try again.');
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalidRequest(400, 'Please complete the interest form.');
  }
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
    throw invalidRequest(413, 'This form submission is too large.');
  }
  return body;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ') : '';
}

export function validateInterest(body) {
  const errors = {};
  const name = cleanText(body.name);
  const email = cleanText(body.email).toLowerCase();
  const major = cleanText(body.major);
  const source = body.source === undefined ? 'rush' : body.source;
  let graduationYear = null;

  if (name.length < 2 || name.length > 120 || /[\u0000-\u001f\u007f]/u.test(name)) {
    errors.name = 'Enter your name, using 2–120 characters.';
  }
  if (email.length > 254 || /[\u0000-\u001f\u007f]/u.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (body.major !== undefined && body.major !== null && typeof body.major !== 'string') {
    errors.major = 'Enter your major as text.';
  } else if (major.length > 120 || /[\u0000-\u001f\u007f]/u.test(major)) {
    errors.major = 'Use 120 characters or fewer for your major.';
  }
  if (body.graduationYear !== undefined && body.graduationYear !== null && body.graduationYear !== '') {
    const year = String(body.graduationYear);
    if (!/^\d{4}$/.test(year) || Number(year) < 2000 || Number(year) > 2100) {
      errors.graduationYear = 'Enter a four-digit graduation year.';
    } else {
      graduationYear = Number(year);
    }
  }
  if (body.consent !== true) {
    errors.consent = 'Please agree to be contacted about Rush.';
  }
  if (!ALLOWED_SOURCES.has(source)) {
    errors.source = 'Please submit the form from this website.';
  }

  return { errors, values: { name, email, major: major || null, graduationYear, source } };
}

function sameOrigin(request) {
  if (request.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

function requestKey(request, env) {
  const forwarded = env.VERCEL ? request.headers['x-vercel-forwarded-for'] : undefined;
  const address = String(forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const secret = env.RATE_LIMIT_SECRET || env.DATABASE_URL;
  return createHmac('sha256', secret).update(address).digest('hex');
}

async function connectDatabase(databaseUrl) {
  const { neon } = await import('@neondatabase/serverless');
  return neon(databaseUrl);
}

export function createInterestHandler({ env = process.env, connect = connectDatabase } = {}) {
  return async function interest(request, response) {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return reply(response, 405, { ok: false, message: 'Use the interest form to submit your details.' });
    }
    if (!sameOrigin(request)) {
      return reply(response, 403, { ok: false, message: 'Please submit the interest form from this website.' });
    }

    let body;
    try {
      body = await readBody(request);
    } catch (error) {
      return reply(response, error.status || 400, { ok: false, message: error.message });
    }
    if (typeof body.website === 'string' && body.website.trim()) {
      return reply(response, 200, { ok: true, message: SUCCESS_MESSAGE });
    }
    const { errors, values } = validateInterest(body);
    if (Object.keys(errors).length) {
      return reply(response, 400, { ok: false, message: 'Please check the highlighted fields.', errors });
    }
    if (!env.DATABASE_URL) {
      return reply(response, 503, { ok: false, message: 'The interest form is temporarily unavailable. Please contact the chapter or try again later.' });
    }

    try {
      const sql = await connect(env.DATABASE_URL);
      const rows = await sql.query(SAVE_INTEREST_SQL, [
        requestKey(request, env), values.name, values.email, values.major,
        values.graduationYear, values.source, env.RUSH_SEASON || 'spring-2027', WINDOW_LIMIT,
      ]);
      if (rows[0]?.rate_limited) {
        response.setHeader('Retry-After', String(WINDOW_SECONDS));
        return reply(response, 429, { ok: false, message: 'Too many attempts from this connection. Please try again later.' });
      }
      if (!rows.length) throw new Error('The interest insert returned no result.');
      return reply(response, 200, { ok: true, message: SUCCESS_MESSAGE });
    } catch {
      return reply(response, 503, { ok: false, message: 'Your interest could not be saved. Please try again or contact the chapter.' });
    }
  };
}

export default createInterestHandler();
