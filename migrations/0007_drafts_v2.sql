-- Migration 0007: recreate drafts with 'application_email' kind and 'dismissed' status.
-- The original drafts table (from schema.sql) used kind IN ('email','linkedin_post')
-- and status IN ('pending','approved','rejected'). SQLite cannot ALTER constraints,
-- so we rename-and-recreate. Any existing rows are migrated safely.

PRAGMA foreign_keys = OFF;

CREATE TABLE drafts_new (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id  INTEGER NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
    kind            TEXT    NOT NULL DEFAULT 'application_email',
    subject         TEXT,
    body            TEXT    NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'dismissed')),
    created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

INSERT INTO drafts_new (id, opportunity_id, kind, subject, body, status, created_at)
SELECT
    id,
    opportunity_id,
    CASE kind
        WHEN 'email'         THEN 'application_email'
        WHEN 'linkedin_post' THEN 'linkedin_post'
        ELSE                      kind
    END,
    subject,
    body,
    CASE status WHEN 'rejected' THEN 'dismissed' ELSE status END,
    created_at
FROM drafts;

DROP TABLE drafts;
ALTER TABLE drafts_new RENAME TO drafts;

CREATE INDEX IF NOT EXISTS idx_drafts_opportunity ON drafts (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_drafts_status      ON drafts (status);

PRAGMA foreign_keys = ON;
