-- statement
CREATE TABLE IF NOT EXISTS pct_schema_migrations (
  version integer PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- statement
CREATE TABLE IF NOT EXISTS interest_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (email = lower(email) AND char_length(email) <= 254),
  major text CHECK (char_length(major) <= 120),
  graduation_year integer CHECK (graduation_year BETWEEN 2000 AND 2100),
  source text NOT NULL CHECK (source IN ('home', 'rush', 'about')),
  season text NOT NULL CHECK (char_length(season) BETWEEN 1 AND 80),
  consent_version text NOT NULL,
  consent_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, season)
);

-- statement
CREATE TABLE IF NOT EXISTS interest_request_limits (
  request_key text PRIMARY KEY CHECK (char_length(request_key) = 64),
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0)
);

-- statement
CREATE INDEX IF NOT EXISTS interest_signups_season_created_idx
  ON interest_signups (season, created_at DESC);

-- statement
INSERT INTO pct_schema_migrations (version) VALUES (1)
ON CONFLICT (version) DO NOTHING;
