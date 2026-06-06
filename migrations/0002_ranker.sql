-- Migration 0002: ranker support
-- Rebuilds opportunities (fit_score 0-100, add fit_reason); extends profile.

PRAGMA foreign_keys = OFF;

-- ── Rebuild opportunities ────────────────────────────────────────────────────
-- SQLite cannot drop or alter CHECK constraints in-place, so we use the
-- standard rename-copy-drop pattern. fit_score is reset to NULL because
-- old 0-1 values are meaningless on the new 0-100 scale.
CREATE TABLE opportunities_new (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    type            TEXT    NOT NULL CHECK (type IN ('internship', 'conference', 'ngo', 'certificate')),
    title           TEXT    NOT NULL,
    organization    TEXT    NOT NULL,
    source          TEXT    NOT NULL,
    url             TEXT,
    location        TEXT,
    deadline        TEXT,
    description     TEXT,
    fit_score       REAL    CHECK (fit_score IS NULL OR (fit_score >= 0 AND fit_score <= 100)),
    fit_reason      TEXT,
    status          TEXT    NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new', 'shortlisted', 'applied', 'rejected', 'archived')),
    dedup_hash      TEXT    NOT NULL UNIQUE,
    discovered_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

INSERT INTO opportunities_new (id, type, title, organization, source, url, location, deadline,
                                description, fit_score, fit_reason, status, dedup_hash, discovered_at)
    SELECT id, type, title, organization, source, url, location, deadline,
           description, NULL, NULL, status, dedup_hash, discovered_at
    FROM opportunities;

DROP TABLE opportunities;
ALTER TABLE opportunities_new RENAME TO opportunities;

CREATE INDEX IF NOT EXISTS idx_opportunities_type     ON opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status   ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities (deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_fit      ON opportunities (fit_score);

PRAGMA foreign_keys = ON;

-- ── Extend profile ────────────────────────────────────────────────────────────
ALTER TABLE profile ADD COLUMN stage      TEXT;
ALTER TABLE profile ADD COLUMN priorities TEXT;  -- JSON array of type strings, ordered
