-- Migration 0008: anonymise profile — swap personal details for John Doe placeholder
-- and clear cv_text so the editor starts blank.

UPDATE profile SET
    name             = 'John Doe',
    headline         = 'Undergraduate, early-career, learning to code',
    skills           = '["beginner programming","Model UN","public speaking","Spanish","chess"]',
    interests        = '["computer science","technology"]',
    target_locations = '["India","Remote","Global"]',
    experience       = NULL,
    cv_text          = NULL,
    updated_at       = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
WHERE id = 1;
