-- Optional: the API creates this table automatically on first use.
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lang TEXT NOT NULL,
  created_at TEXT NOT NULL,
  answers TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  pct INTEGER NOT NULL
);
