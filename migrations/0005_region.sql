-- Migration 0005: add region column to opportunities
-- SQLite ADD COLUMN with a DEFAULT is safe — no rebuild required.
-- All existing rows land on 'unknown'; run GET /backfill-regions once to re-classify them.
ALTER TABLE opportunities ADD COLUMN region TEXT NOT NULL DEFAULT 'unknown';
