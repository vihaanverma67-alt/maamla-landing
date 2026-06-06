import { CollectorResult } from './types';
import { isInternship, computeHash, stripHtml, now, classifyRegion } from './utils';

interface GHJob {
	id: number;
	title: string;
	absolute_url: string;
	location: { name: string };
	content: string;
}

interface GHResponse {
	jobs: GHJob[];
}

export async function collectGreenhouse(token: string, label: string, db: D1Database): Promise<CollectorResult> {
	let res: Response;
	try {
		res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`, {
			headers: { 'User-Agent': 'cv-engine/1.0' },
		});
	} catch (err) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `Fetch failed: ${err}` };
	}

	if (!res.ok) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `HTTP ${res.status}` };
	}

	const data = (await res.json()) as GHResponse;
	const jobs = data.jobs ?? [];
	const fetched = jobs.length;
	let kept = 0;
	let inserted = 0;

	for (const job of jobs) {
		if (!isInternship(job.title)) continue;
		kept++;

		const url = job.absolute_url ?? null;
		const dedup_hash = await computeHash(`greenhouse:${url ?? String(job.id)}`);

		const result = await db
			.prepare(
				`INSERT OR IGNORE INTO opportunities
				 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
				 VALUES ('internship', ?, ?, 'greenhouse', ?, ?, NULL, ?, NULL, 'new', ?, ?, ?)`
			)
			.bind(job.title, label, url, job.location?.name ?? null, job.content ? stripHtml(job.content) : null, dedup_hash, now(), classifyRegion(job.location?.name))
			.run();

		if (result.meta.changes > 0) inserted++;
	}

	return { fetched, kept, inserted, skipped: fetched - kept };
}
