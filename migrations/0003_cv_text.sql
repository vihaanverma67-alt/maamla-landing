-- Migration 0003: add cv_text column to profile + seed with Vihaan's CV

ALTER TABLE profile ADD COLUMN cv_text TEXT;

-- Seed: upsert the profile row with CV plain text.
-- ON CONFLICT(id) updates only the cv_text so any previously set fields survive.
INSERT INTO profile (id, name, cv_text, updated_at)
VALUES (
    1,
    'Vihaan Verma',
    'Vihaan Verma. Undergraduate (started after 12th grade, May 2025), currently in undergrad, learning to code. EDUCATION: CBSE 12th 83.2% (PCM + Computer Science), strong in 10th (93.2%). Studied Computer Science and Artificial Intelligence at school level. STRENGTHS: Model UN — Best Delegate x2 and Committee Chairperson (SAIMUN, Disarmament & Intl Security). Olympiads — SOF English, Math, and National Cyber Olympiad (good international ranks). Strong public speaking, debate, elocution. French (4 years). Chess, multiple sports. GAPS/EMPTY: No listed work or internship experience, no technical projects, no programming languages or tools listed, no current university course listed, no technical certificates.',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
)
ON CONFLICT(id) DO UPDATE SET
    cv_text    = excluded.cv_text,
    updated_at = excluded.updated_at;
