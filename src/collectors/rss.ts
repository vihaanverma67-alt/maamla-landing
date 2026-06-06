import { CollectorResult } from './types';
import { computeHash, stripHtml, now } from './utils';

// ── XML helpers ───────────────────────────────────────────────────────────────

function unwrapCdata(s: string): string {
	const m = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
	return m ? m[1] : s;
}

// Returns the text content of the first matching tag, unwrapping CDATA.
function firstTag(xml: string, tag: string): string {
	const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
	const m = xml.match(re);
	return m ? unwrapCdata(m[1].trim()) : '';
}

// Returns the raw inner XML of every matching tag (case-insensitive).
function allBlocks(xml: string, tag: string): string[] {
	const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi');
	const out: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) !== null) out.push(m[1]);
	return out;
}

// For Atom: extract href="..." from the first <link .../> inside an entry block.
// Falls back to treating <link>url</link> as plain text (RSS fallback).
function atomLink(block: string): string {
	const tagMatch = block.match(/<link(\s[^>]*?)\/?>/i);
	if (tagMatch) {
		const hrefMatch = tagMatch[1].match(/href="([^"]+)"/i);
		if (hrefMatch) return hrefMatch[1];
	}
	return firstTag(block, 'link');
}

function domainOf(url: string): string {
	try { return new URL(url).hostname.replace(/^www\./, ''); }
	catch { return url; }
}

// Valid types after migration 0004
const VALID_TYPES = new Set(['hackathon', 'competition', 'conference', 'internship', 'ngo', 'certificate']);

function normalizeType(t: string | null | undefined): string {
	const lower = (t ?? '').toLowerCase();
	return VALID_TYPES.has(lower) ? lower : 'competition';
}

// ── Collector ─────────────────────────────────────────────────────────────────

export async function collectRss(
	feedUrl: string,
	feedLabel: string,
	eventType: string | null | undefined,
	db: D1Database,
): Promise<CollectorResult> {
	let res: Response;
	try {
		res = await fetch(feedUrl, {
			headers: {
				'User-Agent': 'cv-engine/1.0',
				Accept: 'application/rss+xml, application/atom+xml, text/xml, application/xml, */*',
			},
		});
	} catch (err) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `Fetch failed: ${err}` };
	}

	if (!res.ok) {
		return { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `HTTP ${res.status}` };
	}

	const xml = await res.text();
	const isAtom = /<feed[\s>]/i.test(xml);

	// Feed-level title for the organization field
	const feedTitle = firstTag(xml, 'title') || feedLabel;
	const feedDomain = domainOf(feedUrl);
	const type = normalizeType(eventType);

	const entries = allBlocks(xml, isAtom ? 'entry' : 'item');
	const fetched = entries.length;
	let kept = 0;
	let inserted = 0;

	for (const entry of entries) {
		const title = firstTag(entry, 'title');
		const url = isAtom
			? atomLink(entry)
			: (firstTag(entry, 'link') || firstTag(entry, 'guid'));

		if (!title || !url) continue; // skip malformed entries
		kept++;

		const rawDesc = isAtom
			? (firstTag(entry, 'summary') || firstTag(entry, 'content'))
			: firstTag(entry, 'description');
		const description = rawDesc ? stripHtml(rawDesc) : null;
		const organization = feedTitle || feedDomain;
		const dedup_hash = await computeHash(`rss:${url}`);

		const result = await db
			.prepare(
				`INSERT OR IGNORE INTO opportunities
				 (type, title, organization, source, url, location, deadline, description, fit_score, status, dedup_hash, discovered_at, region)
				 VALUES (?, ?, ?, 'rss', ?, '', NULL, ?, NULL, 'new', ?, ?, 'unknown')`
			)
			.bind(type, title, organization, url, description, dedup_hash, now())
			.run();

		if (result.meta.changes > 0) inserted++;
	}

	return { fetched, kept, inserted, skipped: fetched - kept };
}
