-- Migration 0004: RSS source support
-- • sources: allow ats_type='rss', add nullable event_type column
-- • opportunities: add 'hackathon' and 'competition' to type CHECK
-- SQLite cannot alter CHECK constraints in-place, so we use rename-copy-drop.

PRAGMA foreign_keys = OFF;

-- ── Rebuild sources ───────────────────────────────────────────────────────────
CREATE TABLE sources_new (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ats_type    TEXT    NOT NULL CHECK (ats_type IN ('greenhouse', 'lever', 'rss')),
    token       TEXT    NOT NULL,
    label       TEXT    NOT NULL,
    event_type  TEXT    CHECK (event_type IS NULL OR event_type IN ('hackathon', 'conference', 'competition')),
    active      INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    added_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

INSERT INTO sources_new (id, ats_type, token, label, event_type, active, added_at)
    SELECT id, ats_type, token, label, NULL, active, added_at FROM sources;

DROP TABLE sources;
ALTER TABLE sources_new RENAME TO sources;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sources_ats_token ON sources (ats_type, token);

-- ── Rebuild opportunities ─────────────────────────────────────────────────────
CREATE TABLE opportunities_new (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    type            TEXT    NOT NULL CHECK (type IN ('internship', 'conference', 'ngo', 'certificate', 'hackathon', 'competition')),
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

INSERT INTO opportunities_new
    (id, type, title, organization, source, url, location, deadline,
     description, fit_score, fit_reason, status, dedup_hash, discovered_at)
    SELECT id, type, title, organization, source, url, location, deadline,
           description, fit_score, fit_reason, status, dedup_hash, discovered_at
    FROM opportunities;

DROP TABLE opportunities;
ALTER TABLE opportunities_new RENAME TO opportunities;

CREATE INDEX IF NOT EXISTS idx_opportunities_type     ON opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status   ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities (deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_fit      ON opportunities (fit_score);

PRAGMA foreign_keys = ON;

-- ── Seed: Devpost Hackathons RSS ──────────────────────────────────────────────
INSERT OR IGNORE INTO sources (ats_type, token, label, event_type)
VALUES ('rss', 'https://devpost.com/hackathons.rss', 'Devpost Hackathons', 'hackathon');
