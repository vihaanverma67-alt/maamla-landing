import { CollectorResult } from './types';
import { isInternship, computeHash, stripHtml, now, classifyRegion } from './utils';

interface LeverPosting {
	id: string;
	text: string;
	hostedUrl: string;
	applyUrl: string;
	categories: {
		location?: string;
		team?: string;
		commitment?: string;
	};
	description: string;
	lists?: Array<{ text: string; content: string }>;
	additional?: string;
}

export async function collectLever(token: string, label: string, db: D1Database): Promise<CollectorResult> {
	let res: Response;
	try {
		res = await fetch(`https://api.lever.co/v0/postings/${token}?mode=json`, {
			headers: { 'User-Agent': 'cv-engine/1.0' },
		});
	} catch (err) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `Fetch failed: ${err}` };
	}

	if (!res.ok) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `HTTP ${res.status}` };
	}

	const postings = (await res.json()) as LeverPosting[];
	const fetched = postings.length;
	let kept = 0;
	let inserted = 0;

	for (const posting of postings) {
		if (!isInternship(posting.text)) continue;
		kept++;

		const url = posting.hostedUrl ?? null;
		const dedup_hash = await computeHash(`lever:${url ?? posting.id}`);

		const rawDesc = [posting.description ?? '', ...(posting.lists ?? []).map((l) => `${l.text}\n${l.content}`), posting.additional ?? '']
			.join('\n\n')
			.trim();

		const result = await db
			.prepare(
				`INSERT OR IGNORE INTO opportunities
				 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
				 VALUES ('internship', ?, ?, 'lever', ?, ?, NULL, ?, NULL, 'new', ?, ?, ?)`
			)
			.bind(posting.text, label, url, posting.categories?.location ?? null, rawDesc ? stripHtml(rawDesc) : null, dedup_hash, now(), classifyRegion(posting.categories?.location))
			.run();

		if (result.meta.changes > 0) inserted++;
	}

	return { fetched, kept, inserted, skipped: fetched - kept };
}
