-- cv-engine-db schema
-- Single-user opportunity engine on Cloudflare D1 (SQLite)
-- Apply with: wrangler d1 execute cv-engine-db --file=schema.sql

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- profile
-- Single-row table. INSERT once, UPDATE thereafter.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
    id              INTEGER PRIMARY KEY CHECK (id = 1),  -- enforces single row
    name            TEXT    NOT NULL,
    headline        TEXT,
    skills          TEXT,   -- JSON array of strings
    interests       TEXT,   -- JSON array of strings
    target_locations TEXT,  -- JSON array of strings
    experience      TEXT,   -- JSON blob (roles, years, etc.)
    updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- ---------------------------------------------------------------------------
-- opportunities
-- One row per discovered listing. dedup_hash prevents duplicates.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunities (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    type            TEXT    NOT NULL CHECK (type IN ('internship', 'conference', 'ngo', 'certificate')),
    title           TEXT    NOT NULL,
    organization    TEXT    NOT NULL,
    source          TEXT    NOT NULL,  -- e.g. 'LinkedIn', 'official-site', 'devpost'
    url             TEXT,
    location        TEXT,
    deadline        TEXT,              -- ISO 8601 date string, nullable
    description     TEXT,
    fit_score       REAL    CHECK (fit_score IS NULL OR (fit_score >= 0 AND fit_score <= 1)),
    status          TEXT    NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new', 'shortlisted', 'applied', 'rejected', 'archived')),
    dedup_hash      TEXT    NOT NULL UNIQUE,
    discovered_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_opportunities_type   ON opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities (deadline);

-- ---------------------------------------------------------------------------
-- cv_variants
-- One CV file reference per opportunity (or labelled variant).
-- File content lives in R2/storage; this table holds the lookup key.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cv_variants (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id  INTEGER NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
    label           TEXT    NOT NULL DEFAULT 'default',  -- e.g. 'default', 'concise', 'research-focus'
    storage_key     TEXT    NOT NULL,                    -- R2 object key
    created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (opportunity_id, label)
);

-- ---------------------------------------------------------------------------
-- drafts
-- Drafted outreach emails and LinkedIn posts waiting for review.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drafts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id  INTEGER NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
    kind            TEXT    NOT NULL CHECK (kind IN ('email', 'linkedin_post')),
    subject         TEXT,              -- relevant for kind = 'email'
    body            TEXT    NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_drafts_opportunity ON drafts (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_drafts_status      ON drafts (status);

-- ---------------------------------------------------------------------------
-- actions
-- The approval queue. Every outbound action starts as 'pending'.
-- Nothing is executed until status is manually moved to 'approved'.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS actions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id  INTEGER NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
    draft_id        INTEGER          REFERENCES drafts (id) ON DELETE SET NULL,
    kind            TEXT    NOT NULL CHECK (kind IN ('send_email', 'linkedin_post', 'other')),
    status          TEXT    NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'sent', 'posted', 'failed')),
    result          TEXT,              -- JSON blob: response body, error message, etc.
    queued_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    approved_at     TEXT,
    executed_at     TEXT
);

CREATE INDEX IF NOT EXISTS idx_actions_status       ON actions (status);
CREATE INDEX IF NOT EXISTS idx_actions_opportunity  ON actions (opportunity_id);
