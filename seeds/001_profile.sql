-- Seed: demo profile (single-row, id = 1 enforced by CHECK)
INSERT OR REPLACE INTO profile (
    id, name, headline, skills, interests, target_locations,
    experience, stage, priorities, updated_at
) VALUES (
    1,
    'John Doe',
    'Undergraduate, early-career, learning to code',
    '["beginner programming","Model UN","public speaking","Spanish","chess"]',
    '["computer science","technology"]',
    '["India","Remote","Global"]',
    NULL,
    'undergraduate',
    '["internship","conference","certificate","research"]',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
);
