import { runAllSources } from './collectors/runner';
import { scoreOpportunity, OpportunityForRanking, ProfileForRanking } from './ranker';
import { analyzeCv } from './cv-analyzer';
import { generateSuggestions } from './cv-suggestions';
import { getDashboardHtml } from './dashboard';
import { classifyRegion, now } from './collectors/utils';
import { generateDraft } from './drafter';
import { getVerifiedUserEmail } from './auth';
import { parseCv, detectFromText } from './cv-parser';

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

// Returns the verified caller email. A real Access token always takes priority.
// The dev fallback (DEV_FALLBACK_EMAIL in .dev.vars) can only activate when:
//   - no real token was present or valid, AND
//   - IS_LOCAL_DEV === "true" (also .dev.vars only), AND
//   - ACCESS_TEAM_DOMAIN is absent/empty (belt-and-suspenders: won't be true in prod).
// Neither .dev.vars var is uploaded by `wrangler deploy`, so the fallback is
// structurally impossible to activate in production.
async function resolveEmail(request: Request, env: Env): Promise<string | null> {
	// Step 1: real verification first — a valid token always wins.
	const verified = await getVerifiedUserEmail(request, env);
	if (verified) return verified;

	// Step 2: dev-only fallback, only when no real identity was resolved.
	// Both guards must be satisfied; both vars live exclusively in .dev.vars.
	const e = env as unknown as Record<string, string | undefined>;
	const devEmail = e['DEV_FALLBACK_EMAIL'];
	const isLocal  = e['IS_LOCAL_DEV'] === 'true' || !e['ACCESS_TEAM_DOMAIN'];
	if (devEmail && isLocal) return devEmail;

	return null;
}

const VALID_ATS = new Set(['greenhouse', 'lever', 'rss']);
const VALID_EVENT_TYPES = new Set(['hackathon', 'conference', 'competition']);

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.replace(/\/$/, '');
		const method = request.method;
		const db = env.cv_engine_db;
		const segments = path.split('/').filter(Boolean);

		try {
			// GET / — dashboard
			if (method === 'GET' && path === '') {
				return new Response(getDashboardHtml(), {
					headers: { 'Content-Type': 'text/html;charset=UTF-8' },
				});
			}

			// GET /me — identity + onboarding status
			if (method === 'GET' && path === '/me') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ authenticated: false }, 401);
				const row = await db
					.prepare('SELECT name FROM profile WHERE user_email = ?')
					.bind(email)
					.first<{ name: string }>();
				if (!row) return json({ authenticated: true, onboarded: false, email });
				return json({ authenticated: true, onboarded: true, email, name: row.name });
			}

			// POST /onboard — create profile for first-time user
			if (method === 'POST' && path === '/onboard') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);

				// Clobber guard: never overwrite an existing profile
				const existing = await db
					.prepare('SELECT 1 FROM profile WHERE user_email = ?')
					.bind(email)
					.first();
				if (existing) return json({ error: 'already_onboarded' }, 409);

				const body = (await request.json()) as {
					name?: unknown;
					stage?: unknown;
					education?: unknown;
					skills?: unknown;
					interests?: unknown;
					target_locations?: unknown;
					achievements?: unknown;
					experience?: unknown;
					cv_text?: unknown;
				};

				const name = typeof body.name === 'string' ? body.name.trim() : '';
				if (!name) return json({ error: 'name_required' }, 400);

				const stage        = typeof body.stage === 'string' ? body.stage.trim() : '';
				const education    = typeof body.education === 'string' ? body.education.trim() : '';
				const experience   = typeof body.experience === 'string' ? body.experience.trim() : '';
				const skills       = Array.isArray(body.skills)           ? (body.skills as string[]) : [];
				const interests    = Array.isArray(body.interests)         ? (body.interests as string[]) : [];
				const targetLocs   = Array.isArray(body.target_locations)  ? (body.target_locations as string[]) : [];
				const achievements = Array.isArray(body.achievements)       ? (body.achievements as string[]) : [];

				const cvTextOverride = typeof body.cv_text === 'string' && body.cv_text.trim() ? body.cv_text.trim() : null;

				const cv_text =
					cvTextOverride ??
					[
						name,
						stage,
						'',
						'EDUCATION',
						education,
						'',
						'SKILLS',
						skills.join(', '),
						'',
						'ACHIEVEMENTS',
						achievements.join('\n'),
						'',
						'EXPERIENCE',
						experience || '—',
						'',
						'INTERESTS',
						interests.join(', '),
					].join('\n');

				const headline = stage || education.split('\n')[0] || '';

				await db
					.prepare(
						`INSERT INTO profile
						 (user_email, name, headline, skills, interests, target_locations, experience, stage, cv_text, updated_at)
						 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
					)
					.bind(
						email,
						name,
						headline,
						JSON.stringify(skills),
						JSON.stringify(interests),
						JSON.stringify(targetLocs),
						experience,
						stage,
						cv_text,
						now(),
					)
					.run();

				return json({ ok: true, onboarded: true });
			}

			// POST /parse-cv — extract text + detect structure from uploaded CV file
			if (method === 'POST' && path === '/parse-cv') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);

				const ct = request.headers.get('content-type') ?? '';
				if (!ct.includes('multipart/form-data')) {
					return json({ error: 'Expected multipart/form-data' }, 400);
				}

				const formData = await request.formData();
				const file = formData.get('file');
				if (!(file instanceof File)) return json({ error: 'No file field found' }, 400);

				const MAX_BYTES = 2 * 1024 * 1024;
				if (file.size > MAX_BYTES) {
					return json({ error: 'File too large — maximum 2 MB. Paste your CV text directly.' }, 413);
				}

				const lname = file.name.toLowerCase();
				if (!lname.endsWith('.pdf') && !lname.endsWith('.docx') && !lname.endsWith('.txt')) {
					return json({ error: 'Unsupported file type. Upload a .pdf, .docx, or .txt file.' }, 400);
				}

				const buffer = await file.arrayBuffer();
				const { text, warning } = parseCv(buffer, file.name);
				const detected = text ? detectFromText(text) : { name: null, stage: null, skills: [] };

				return json({ text, detected, warning });
			}

			// GET /profile — return structured profile fields for the logged-in user
			if (method === 'GET' && path === '/profile') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const row = await db
					.prepare('SELECT name, stage, skills, interests, target_locations, experience FROM profile WHERE user_email = ?')
					.bind(email)
					.first<{ name: string; stage: string; skills: string; interests: string; target_locations: string; experience: string }>();
				if (!row) return json({ error: 'no_profile' });
				return json({
					name: row.name,
					stage: row.stage ?? '',
					skills: JSON.parse(row.skills ?? '[]'),
					interests: JSON.parse(row.interests ?? '[]'),
					target_locations: JSON.parse(row.target_locations ?? '[]'),
					experience: row.experience ?? '',
				});
			}

			// PATCH /profile — update structured profile fields (does not touch cv_text — use POST /cv for that)
			if (method === 'PATCH' && path === '/profile') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const existing = await db
					.prepare('SELECT user_email FROM profile WHERE user_email = ?')
					.bind(email)
					.first();
				if (!existing) return json({ error: 'no_profile' }, 404);
				const body = (await request.json()) as {
					name?: unknown;
					stage?: unknown;
					skills?: unknown;
					interests?: unknown;
					target_locations?: unknown;
					experience?: unknown;
				};
				const name = typeof body.name === 'string' ? body.name.trim() : '';
				if (!name) return json({ error: 'name_required' }, 400);
				const stage      = typeof body.stage === 'string' ? body.stage.trim() : '';
				const skills     = Array.isArray(body.skills)            ? (body.skills as string[]) : [];
				const interests  = Array.isArray(body.interests)         ? (body.interests as string[]) : [];
				const targetLocs = Array.isArray(body.target_locations)  ? (body.target_locations as string[]) : [];
				const experience = typeof body.experience === 'string' ? body.experience.trim() : '';
				await db
					.prepare('UPDATE profile SET name = ?, stage = ?, skills = ?, interests = ?, target_locations = ?, experience = ?, updated_at = ? WHERE user_email = ?')
					.bind(name, stage, JSON.stringify(skills), JSON.stringify(interests), JSON.stringify(targetLocs), experience || null, now(), email)
					.run();
				return json({ ok: true });
			}

			// POST /sources/bulk — must come before POST /sources
			if (method === 'POST' && path === '/sources/bulk') {
				const body = (await request.json()) as unknown;
				if (!Array.isArray(body)) return json({ error: 'Expected an array' }, 400);

				for (const s of body) {
					if (!s.ats_type || !s.token || !s.label) return json({ error: 'Each entry needs ats_type, token, label' }, 400);
					if (!VALID_ATS.has(s.ats_type)) return json({ error: `Invalid ats_type: ${s.ats_type}` }, 400);
					if (s.event_type != null && !VALID_EVENT_TYPES.has(s.event_type)) {
						return json({ error: `Invalid event_type: ${s.event_type}` }, 400);
					}
				}

				const stmts = (body as Array<{ ats_type: string; token: string; label: string; event_type?: string }>).map((s) =>
					db.prepare('INSERT OR IGNORE INTO sources (ats_type, token, label, event_type) VALUES (?, ?, ?, ?)')
						.bind(s.ats_type, s.token, s.label, s.event_type ?? null)
				);

				const results = await db.batch(stmts);
				const inserted = results.reduce((sum: number, r) => sum + (r.meta.changes ?? 0), 0);
				return json({ inserted, total: body.length });
			}

			// POST /sources
			if (method === 'POST' && path === '/sources') {
				const body = (await request.json()) as { ats_type?: string; token?: string; label?: string; event_type?: string };
				if (!body.ats_type || !body.token || !body.label) return json({ error: 'ats_type, token, and label are required' }, 400);
				if (!VALID_ATS.has(body.ats_type)) return json({ error: `Invalid ats_type: ${body.ats_type}` }, 400);
				if (body.event_type != null && !VALID_EVENT_TYPES.has(body.event_type)) {
					return json({ error: `Invalid event_type: ${body.event_type}` }, 400);
				}

				const result = await db
					.prepare('INSERT INTO sources (ats_type, token, label, event_type) VALUES (?, ?, ?, ?)')
					.bind(body.ats_type, body.token, body.label, body.event_type ?? null)
					.run();

				return json({ id: result.meta.last_row_id }, 201);
			}

			// GET /sources
			if (method === 'GET' && path === '/sources') {
				const { results } = await db.prepare('SELECT * FROM sources ORDER BY added_at DESC').all();
				return json(results);
			}

			// GET /collect
			if (method === 'GET' && path === '/collect') {
				const runResult = await runAllSources(db);
				return json(runResult);
			}

			// POST /rank — score all opportunities against the profile
			if (method === 'POST' && path === '/rank') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);

				const profileRow = await db
					.prepare('SELECT target_locations, priorities FROM profile WHERE user_email = ?')
					.bind(email)
					.first<{ target_locations: string; priorities: string }>();

				if (!profileRow) return json({ error: 'no_profile', note: 'User has not onboarded yet' });

				const profile: ProfileForRanking = {
					target_locations: JSON.parse(profileRow.target_locations ?? '[]'),
					priorities:       JSON.parse(profileRow.priorities ?? '[]'),
				};

				const { results: opps } = await db
					.prepare('SELECT id, type, title, description, location FROM opportunities')
					.all<OpportunityForRanking & { id: number }>();

				const stmts = opps.map((opp) => {
					const { score, fit_reason } = scoreOpportunity(opp, profile);
					return db
						.prepare('UPDATE opportunities SET fit_score = ?, fit_reason = ? WHERE id = ?')
						.bind(score, fit_reason, opp.id);
				});

				if (stmts.length > 0) await db.batch(stmts);
				return json({ scored: opps.length });
			}

			// GET /opportunities
			if (method === 'GET' && path === '/opportunities') {
				const sort    = url.searchParams.get('sort');
				const section = url.searchParams.get('section'); // india | global | conf
				const rawLimit  = parseInt(url.searchParams.get('limit')  ?? '25', 10);
				const rawOffset = parseInt(url.searchParams.get('offset') ?? '0',  10);
				const limit  = isNaN(rawLimit)  || rawLimit  < 1 ? 25 : Math.min(rawLimit, 200);
				const offset = isNaN(rawOffset) || rawOffset < 0 ? 0  : rawOffset;

				const SECTION_WHERE: Record<string, string> = {
					india:  "type = 'internship' AND region = 'india'",
					global: "type = 'internship' AND region != 'india'",
					conf:   "type != 'internship'",
				};

				const whereClause = section && SECTION_WHERE[section]
					? `WHERE ${SECTION_WHERE[section]}`
					: '';
				const orderBy = sort === 'newest'
					? 'discovered_at DESC'
					: 'fit_score DESC, discovered_at DESC';

				const [countRow, { results }] = await Promise.all([
					db.prepare(`SELECT COUNT(*) AS total FROM opportunities ${whereClause}`)
						.first<{ total: number }>(),
					db.prepare(
						`SELECT * FROM opportunities ${whereClause} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`
					).all(),
				]);

				return json({ results, total: countRow?.total ?? 0 });
			}

			// GET /cv-analysis
			if (method === 'GET' && path === '/cv-analysis') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const report = await analyzeCv(db, email);
				if (report === null) return json({ error: 'no_profile', note: 'User has not onboarded yet' });
				return json(report);
			}

			// GET /cv-suggestions — rule-based suggestions (no external API)
			if (method === 'GET' && path === '/cv-suggestions') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const suggestions = await generateSuggestions(db, email);
				if (suggestions === null) return json({ error: 'no_profile', note: 'User has not onboarded yet' });
				return json(suggestions);
			}

			// GET /cv — return current cv_text
			if (method === 'GET' && path === '/cv') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const row = await db
					.prepare('SELECT cv_text FROM profile WHERE user_email = ?')
					.bind(email)
					.first<{ cv_text: string | null }>();
				if (!row) return json({ error: 'no_profile', note: 'User has not onboarded yet' });
				return json({ cv_text: row.cv_text ?? null });
			}

			// POST /cv — save edited cv_text (only on explicit user action)
			if (method === 'POST' && path === '/cv') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const body = (await request.json()) as { cv_text?: unknown };
				if (typeof body.cv_text !== 'string') return json({ error: 'cv_text must be a string' }, 400);
				const result = await db
					.prepare('UPDATE profile SET cv_text = ?, updated_at = ? WHERE user_email = ?')
					.bind(body.cv_text, now(), email)
					.run();
				if (result.meta.changes === 0) return json({ error: 'no_profile', note: 'User has not onboarded yet' });
				return json({ ok: true });
			}

			// GET /backfill-regions — one-time re-classification of existing rows
			if (method === 'GET' && path === '/backfill-regions') {
				const { results: opps } = await db
					.prepare('SELECT id, location FROM opportunities')
					.all<{ id: number; location: string | null }>();
				const stmts = opps.map((opp) =>
					db.prepare('UPDATE opportunities SET region = ? WHERE id = ?')
						.bind(classifyRegion(opp.location), opp.id)
				);
				if (stmts.length > 0) await db.batch(stmts);
				return json({ updated: opps.length });
			}

			// POST /draft/:opportunityId — generate and store a draft, return it enriched
			if (method === 'POST' && segments.length === 2 && segments[0] === 'draft') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const oppId = parseInt(segments[1], 10);
				if (isNaN(oppId)) return json({ error: 'Invalid opportunity id' }, 400);
				const draft = await generateDraft(db, oppId, email);
				if (draft === null) return json({ error: 'no_profile', note: 'User has not onboarded yet' });
				return json(draft, 201);
			}

			// GET /drafts — list this user's drafts with opportunity info, newest first
			if (method === 'GET' && segments.length === 1 && segments[0] === 'drafts') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const { results } = await db
					.prepare(
						`SELECT d.*, o.title AS opp_title, o.organization AS opp_organization,
						        o.url AS opp_url, o.type AS opp_type
						 FROM drafts d
						 JOIN opportunities o ON o.id = d.opportunity_id
						 WHERE d.user_email = ?
						 ORDER BY d.created_at DESC`
					)
					.bind(email)
					.all();
				return json(results);
			}

			// PATCH /drafts/:id — save edits to subject and/or body (owner only)
			if (method === 'PATCH' && segments.length === 2 && segments[0] === 'drafts') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const draftId = parseInt(segments[1], 10);
				if (isNaN(draftId)) return json({ error: 'Invalid draft id' }, 400);
				const body = (await request.json()) as { subject?: unknown; body?: unknown };
				const sets: string[] = [];
				const binds: unknown[] = [];
				if (typeof body.subject === 'string') { sets.push('subject = ?'); binds.push(body.subject); }
				if (typeof body.body === 'string') { sets.push('body = ?'); binds.push(body.body); }
				if (sets.length === 0) return json({ error: 'No fields to update' }, 400);
				binds.push(draftId, email);
				const r = await db.prepare(`UPDATE drafts SET ${sets.join(', ')} WHERE id = ? AND user_email = ?`).bind(...binds).run();
				if (r.meta.changes === 0) return json({ error: 'Draft not found' }, 404);
				return json({ ok: true });
			}

			// POST /drafts/:id/approve — mark draft as approved (owner only; does NOT send anything)
			if (method === 'POST' && segments.length === 3 && segments[0] === 'drafts' && segments[2] === 'approve') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const draftId = parseInt(segments[1], 10);
				if (isNaN(draftId)) return json({ error: 'Invalid draft id' }, 400);
				const r = await db.prepare("UPDATE drafts SET status = 'approved' WHERE id = ? AND user_email = ?").bind(draftId, email).run();
				if (r.meta.changes === 0) return json({ error: 'Draft not found' }, 404);
				return json({ ok: true });
			}

			// POST /drafts/:id/dismiss — mark draft as dismissed (owner only)
			if (method === 'POST' && segments.length === 3 && segments[0] === 'drafts' && segments[2] === 'dismiss') {
				const email = await resolveEmail(request, env);
				if (!email) return json({ error: 'not_authenticated' }, 401);
				const draftId = parseInt(segments[1], 10);
				if (isNaN(draftId)) return json({ error: 'Invalid draft id' }, 400);
				const r = await db.prepare("UPDATE drafts SET status = 'dismissed' WHERE id = ? AND user_email = ?").bind(draftId, email).run();
				if (r.meta.changes === 0) return json({ error: 'Draft not found' }, 404);
				return json({ ok: true });
			}

			return json({ error: 'Not found' }, 404);
		} catch (err) {
			return json({ error: String(err) }, 500);
		}
	},

	async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
		await runAllSources(env.cv_engine_db);
	},
} satisfies ExportedHandler<Env>;
