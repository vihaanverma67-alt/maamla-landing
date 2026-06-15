-- Replace shared fit_score on opportunities with per-user scores.
-- POST /rank now writes here; GET /opportunities LEFT JOINs per user.
CREATE TABLE IF NOT EXISTS user_fit_scores (
  user_email     TEXT    NOT NULL,
  opportunity_id INTEGER NOT NULL,
  fit_score      INTEGER NOT NULL DEFAULT 0,
  fit_reason     TEXT,
  updated_at     TEXT    NOT NULL,
  PRIMARY KEY (user_email, opportunity_id)
);

-- Clear the old shared scores so stale values don't persist alongside new ones.
UPDATE opportunities SET fit_score = 0, fit_reason = NULL;
