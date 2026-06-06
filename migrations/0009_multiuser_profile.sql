-- Migration 0009: rebuild profile for multi-user (one row per verified email)
-- and stamp existing drafts with the original owner's email.
--
-- Why a rebuild: the original table has CHECK(id = 1) which SQLite cannot drop
-- via ALTER TABLE. We create profile_new, copy the single existing row, then swap.
--
-- profile_new column list (all 11 original columns preserved, CHECK removed, user_email added):
--   id               INTEGER PRIMARY KEY AUTOINCREMENT
--   user_email       TEXT    NOT NULL  UNIQUE  ← new; the per-user key
--   name             TEXT    NOT NULL
--   headline         TEXT
--   skills           TEXT
--   interests        TEXT
--   target_locations TEXT
--   experience       TEXT
--   updated_at       TEXT    NOT NULL  DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
--   stage            TEXT
--   priorities       TEXT
--   cv_text          TEXT

PRAGMA foreign_keys = OFF;

-- ── Step 1: create profile_new ───────────────────────────────────────────────
CREATE TABLE profile_new (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email       TEXT    NOT NULL,
    name             TEXT    NOT NULL,
    headline         TEXT,
    skills           TEXT,
    interests        TEXT,
    target_locations TEXT,
    experience       TEXT,
    updated_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    stage            TEXT,
    priorities       TEXT,
    cv_text          TEXT,
    UNIQUE (user_email)
);

-- ── Step 2: copy the existing single row, stamping with the owner's email ────
INSERT INTO profile_new (
    id, user_email,
    name, headline, skills, interests,
    target_locations, experience, updated_at,
    stage, priorities, cv_text
)
SELECT
    id,
    'vihaanverma67@gmail.com',
    name, headline, skills, interests,
    target_locations, experience, updated_at,
    stage, priorities, cv_text
FROM profile;

-- ── Step 3: swap tables ───────────────────────────────────────────────────────
DROP TABLE profile;
ALTER TABLE profile_new RENAME TO profile;

-- ── Step 4: add user_email to drafts (nullable — backfill existing rows) ─────
ALTER TABLE drafts ADD COLUMN user_email TEXT;
UPDATE drafts SET user_email = 'vihaanverma67@gmail.com' WHERE user_email IS NULL;

PRAGMA foreign_keys = ON;
