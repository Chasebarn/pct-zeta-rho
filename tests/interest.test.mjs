import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import test from 'node:test';
import { createInterestHandler, SAVE_INTEREST_SQL, validateInterest } from '../api/interest.js';

const sample = {
  name: 'Test Member',
  email: 'member@example.test',
  major: 'Finance',
  graduationYear: 2029,
  consent: true,
  website: '',
  source: 'rush',
};

function responseRecorder() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body ? JSON.parse(body) : null; },
  };
}

async function submit(handler, body = sample, options = {}) {
  const request = Readable.from(options.chunks || []);
  Object.assign(request, {
    method: options.method || 'POST',
    headers: { 'content-type': 'application/json', host: 'pct.example.test', ...options.headers },
    socket: { remoteAddress: '192.0.2.10' },
  });
  if (!options.stream) request.body = body;
  const response = responseRecorder();
  await handler(request, response);
  return response;
}

test('normalizes one email key and keeps optional fields empty', () => {
  const result = validateInterest({ ...sample, email: ' MEMBER@EXAMPLE.TEST ', major: '', graduationYear: '' });
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.email, 'member@example.test');
  assert.equal(result.values.major, null);
  assert.equal(result.values.graduationYear, null);
});

test('rejects consent strings, control characters, and malformed graduation years', () => {
  const { errors } = validateInterest({ ...sample, consent: 'true', email: 'a\u0000@example.test', graduationYear: '2029.5' });
  assert.deepEqual(Object.keys(errors).sort(), ['consent', 'email', 'graduationYear']);
});

test('GET never reads or changes signup data', async () => {
  let connections = 0;
  const handler = createInterestHandler({ connect: () => { connections++; } });
  const response = await submit(handler, sample, { method: 'GET' });
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, 'POST');
  assert.equal(connections, 0);
});

test('rejects foreign origins and oversized streamed bodies before connecting', async () => {
  let connections = 0;
  const handler = createInterestHandler({ connect: () => { connections++; } });
  const foreign = await submit(handler, sample, { headers: { origin: 'https://other.example.test' } });
  assert.equal(foreign.statusCode, 403);
  const oversized = await submit(handler, null, { stream: true, chunks: [Buffer.alloc(12_001, 'a')] });
  assert.equal(oversized.statusCode, 413);
  assert.equal(connections, 0);
});

test('malformed JSON and wrong content type return errors without database work', async () => {
  const handler = createInterestHandler();
  assert.equal((await submit(handler, '{')).statusCode, 400);
  assert.equal((await submit(handler, sample, { headers: { 'content-type': 'text/plain' } })).statusCode, 415);
});

test('an absent database and a failed insert cannot report success', async () => {
  const unavailable = await submit(createInterestHandler({ env: {} }));
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.body.ok, false);
  const failed = await submit(createInterestHandler({
    env: { DATABASE_URL: 'server-only-value' },
    connect: async () => ({ query: async () => { throw new Error('private credentials'); } }),
  }));
  assert.equal(failed.statusCode, 503);
  assert.equal(failed.body.ok, false);
  assert.doesNotMatch(JSON.stringify(failed.body), /private credentials|server-only-value/);
});

test('uses one parameterized database call and derives season on the server', async () => {
  const calls = [];
  const handler = createInterestHandler({
    env: { DATABASE_URL: 'server-only-value', RUSH_SEASON: 'fall-2027', RATE_LIMIT_SECRET: 'private-secret' },
    connect: async () => ({ query: async (...args) => { calls.push(args); return [{ rate_limited: false, inserted: true }]; } }),
  });
  const name = "Student'); DELETE FROM interest_signups; --";
  const response = await submit(handler, { ...sample, name, season: 'attacker-season' });
  assert.equal(response.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], SAVE_INTEREST_SQL);
  assert.doesNotMatch(calls[0][0], /Student/);
  assert.equal(calls[0][1][1], name);
  assert.equal(calls[0][1][6], 'fall-2027');
  assert.equal(calls[0][1][7], 120);
  assert.match(calls[0][0], /date_bin\('10 minutes'/);
  assert.match(calls[0][1][0], /^[a-f0-9]{64}$/);
  assert.equal(response.headers['Cache-Control'], 'no-store');
});

test('duplicate submissions keep the same success response', async () => {
  let first = true;
  const handler = createInterestHandler({
    env: { DATABASE_URL: 'server-only-value' },
    connect: async () => ({ query: async () => {
      const inserted = first;
      first = false;
      return [{ rate_limited: false, inserted }];
    } }),
  });
  const one = await submit(handler);
  const retry = await submit(handler, { ...sample, email: 'MEMBER@EXAMPLE.TEST' });
  assert.equal(one.statusCode, 200);
  assert.deepEqual(one.body, retry.body);
});

test('the database decides throttling and no success leaks through the limit', async () => {
  const handler = createInterestHandler({
    env: { DATABASE_URL: 'server-only-value' },
    connect: async () => ({ query: async () => [{ rate_limited: true, inserted: false }] }),
  });
  const response = await submit(handler);
  assert.equal(response.statusCode, 429);
  assert.equal(response.headers['Retry-After'], '600');
  assert.equal(response.body.ok, false);
});
