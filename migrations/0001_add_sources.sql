-- Migration 0001: add sources table for ATS integrations

CREATE TABLE IF NOT EXISTS sources (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    ats_type TEXT    NOT NULL CHECK (ats_type IN ('greenhouse', 'lever')),
    token    TEXT    NOT NULL,
    label    TEXT    NOT NULL,
    active   INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    added_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sources_ats_token ON sources (ats_type, token);
