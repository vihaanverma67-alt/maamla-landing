// ─── Template config — edit this block to customise draft generation ──────────
// Patterns are matched case-insensitively against your stored cv_text.
// Only entries whose patterns fire in the actual CV text are included in the draft.
// Up to 3 matching highlights are used (highest-priority first).
const DRAFT_CONFIG = {
	subject_template: 'Application — {title} at {organization} | {name}',

	greeting: 'Dear Hiring Team,',

	intro_template:
		'I am writing to express my interest in the {title} opportunity at {organization}.',

	highlight_patterns: [
		{
			label: 'Model UN — Best Delegate (×2) and Committee Chairperson',
			patterns: ['model un', 'best delegate', 'committee chairperson', 'mun'],
		},
		{
			label: 'Olympiad achievements in Science, Mathematics, and Cyber (national/international ranks)',
			patterns: ['olympiad', 'science olympiad', 'math olympiad', 'cyber olympiad'],
		},
		{
			label: 'Spanish language proficiency (4 years of study)',
			patterns: ['spanish'],
		},
		{
			label: 'currently pursuing an undergraduate degree with a focus on Computer Science',
			patterns: ['undergrad', 'undergraduate', 'b.tech', 'btech', 'bachelor', 'university', 'college'],
		},
		{
			label: 'strong academic record (92.4% Grade 10, 82.7% Grade 12)',
			patterns: ['92.4', '82.7', '92%'],
		},
	],

	// Used only when cv_text is empty or no patterns match
	no_highlights_fallback: '[Add 2–3 genuine highlights from your CV here before sending]',

	cv_note: 'Please find my CV attached.',

	closing_template:
		'I would welcome the opportunity to contribute to {organization}. Thank you for your time and consideration.\n\nBest regards,\n{name}',
} as const;
// ─────────────────────────────────────────────────────────────────────────────

export interface DraftResult {
	id: number;
	opportunity_id: number;
	kind: string;
	subject: string;
	body: string;
	status: string;
	created_at: string;
	opp_title: string;
	opp_organization: string;
	opp_url: string | null;
}

interface ProfileRow {
	name: string;
	cv_text: string | null;
}

interface OpportunityRow {
	id: number;
	title: string;
	organization: string;
	url: string | null;
}

interface StoredDraft {
	id: number;
	opportunity_id: number;
	kind: string;
	subject: string;
	body: string;
	status: string;
	created_at: string;
}

function fill(template: string, vars: Record<string, string>): string {
	return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

function pickHighlights(cvText: string): string[] {
	const lc = cvText.toLowerCase();
	const matched = DRAFT_CONFIG.highlight_patterns.filter((hp) =>
		hp.patterns.some((p) => lc.includes(p))
	);
	if (matched.length === 0) return [DRAFT_CONFIG.no_highlights_fallback];
	return matched.slice(0, 3).map((hp) => hp.label);
}

export async function generateDraft(db: D1Database, opportunityId: number, userEmail: string): Promise<DraftResult | null> {
	const opp = await db
		.prepare('SELECT id, title, organization, url FROM opportunities WHERE id = ?')
		.bind(opportunityId)
		.first<OpportunityRow>();
	if (!opp) throw new Error(`Opportunity ${opportunityId} not found`);

	const profile = await db
		.prepare('SELECT name, cv_text FROM profile WHERE user_email = ?')
		.bind(userEmail)
		.first<ProfileRow>();
	if (!profile) return null;

	const highlights = pickHighlights(profile.cv_text ?? '');
	const vars = { title: opp.title, organization: opp.organization, name: profile.name };

	const subject = fill(DRAFT_CONFIG.subject_template, vars);
	const highlightBlock = highlights.map((h) => `  • ${h}`).join('\n');

	const body = [
		DRAFT_CONFIG.greeting,
		'',
		fill(DRAFT_CONFIG.intro_template, vars),
		'',
		'A few highlights from my background:',
		highlightBlock,
		'',
		DRAFT_CONFIG.cv_note,
		'',
		fill(DRAFT_CONFIG.closing_template, vars),
	].join('\n');

	const r = await db
		.prepare(
			"INSERT INTO drafts (opportunity_id, kind, subject, body, status, user_email) VALUES (?, 'application_email', ?, ?, 'pending', ?)"
		)
		.bind(opportunityId, subject, body, userEmail)
		.run();

	const draft = await db
		.prepare('SELECT * FROM drafts WHERE id = ?')
		.bind(r.meta.last_row_id)
		.first<StoredDraft>();

	if (!draft) throw new Error('Failed to retrieve draft after insert');

	return {
		...draft,
		opp_title: opp.title,
		opp_organization: opp.organization,
		opp_url: opp.url,
	};
}
