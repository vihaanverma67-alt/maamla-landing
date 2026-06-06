import { CollectorResult } from './types';
import { computeHash, now, classifyRegion } from './utils';

// ── Config ────────────────────────────────────────────────────────────────────
// Edit TOPICS or targetYears() to change which files are fetched.
const TOPICS = ['general', 'data', 'ai', 'javascript', 'python', 'devops', 'security', 'ux'];

function targetYears(): number[] {
	const y = new Date().getFullYear();
	return [y, y + 1];
}

const BASE = 'https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences';

// ── Raw shape from confs.tech JSON files ──────────────────────────────────────
interface ConftechEntry {
	name: string;
	url: string;
	startDate: string;   // "YYYY-MM-DD"
	endDate?: string;
	city?: string;
	country?: string;
	cfpUrl?: string;
	cfpEndDate?: string;
}

// ── Collector ─────────────────────────────────────────────────────────────────

export async function collectConfstech(db: D1Database): Promise<CollectorResult> {
	const years = targetYears();
	const today = new Date().toISOString().slice(0, 10);
	let fetched = 0;
	let kept = 0;
	let inserted = 0;

	for (const year of years) {
		for (const topic of TOPICS) {
			const fileUrl = `${BASE}/${year}/${topic}.json`;
			let entries: ConftechEntry[];

			try {
				const res = await fetch(fileUrl, { headers: { 'User-Agent': 'cv-engine/1.0' } });
				if (!res.ok) continue; // 404 or unavailable — skip gracefully
				entries = (await res.json()) as ConftechEntry[];
			} catch {
				continue;
			}

			if (!Array.isArray(entries)) continue;
			fetched += entries.length;

			for (const conf of entries) {
				if (!conf.name || !conf.url || !conf.startDate) continue;

				// Skip past events
				if (conf.startDate < today) continue;
				kept++;

				const city = conf.city ?? '';
				const country = conf.country ?? '';
				const isOnline = /online|remote|virtual/i.test(city) || /online|remote|virtual/i.test(country);
				const location = isOnline
					? 'Online'
					: [city, country].filter(Boolean).join(', ') || 'TBD';

				const dateRange =
					conf.endDate && conf.endDate !== conf.startDate
						? `${conf.startDate} to ${conf.endDate}`
						: conf.startDate;

				let description = `Tech conference in ${location}, ${dateRange}.`;
				if (conf.cfpUrl) {
					description += conf.cfpEndDate
						? ` CFP deadline: ${conf.cfpEndDate}. Submit: ${conf.cfpUrl}`
						: ` CFP open: ${conf.cfpUrl}`;
				}

				const deadline = conf.cfpEndDate ?? conf.startDate;
				const region = isOnline ? 'global' : classifyRegion(`${city}, ${country}`);
				const dedup_hash = await computeHash(`confstech:${conf.url}:${conf.startDate}`);

				const result = await db
					.prepare(
						`INSERT OR IGNORE INTO opportunities
						 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
						 VALUES ('conference', ?, ?, 'confstech', ?, ?, ?, ?, NULL, 'new', ?, ?, ?)`,
					)
					.bind(conf.name, conf.name, conf.url, location, deadline, description, dedup_hash, now(), region)
					.run();

				if (result.meta.changes > 0) inserted++;
			}
		}
	}

	return { fetched, kept, inserted, skipped: fetched - kept };
}
