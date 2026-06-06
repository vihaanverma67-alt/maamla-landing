-- Migration 0006: disable the Devpost hackathons RSS seed (feed is dead/unreliable)
-- The rss collector code stays intact for future use; only this seed row is disabled.
UPDATE sources SET active = 0 WHERE ats_type = 'rss' AND token = 'https://devpost.com/hackathons.rss';
