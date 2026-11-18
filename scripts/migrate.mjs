import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL before running the database migration.');
  process.exitCode = 1;
} else {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const migration = await readFile(new URL('../database/001-interest-signups.sql', import.meta.url), 'utf8');
    const statements = migration.split('-- statement').map(statement => statement.trim()).filter(Boolean);
    await sql.transaction([
      sql.query('SELECT pg_advisory_xact_lock(731902176)'),
      ...statements.map(statement => sql.query(statement)),
    ]);
    console.log('Database migration 1 applied. Existing signups were preserved.');
  } catch {
    console.error('Database migration failed. Check the database connection and retry.');
    process.exitCode = 1;
  }
}
