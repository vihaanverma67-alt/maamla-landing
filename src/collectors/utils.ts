// ── Internship filter ─────────────────────────────────────────────────────────
const INTERNSHIP_RE = /intern(ship)?|co-?op|graduate|new\s+grad|entry.?level/i;

export function isInternship(title: string): boolean {
	return INTERNSHIP_RE.test(title);
}

export async function computeHash(input: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>/gi, '\n\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#\d+;/g, ' ')
		.replace(/&[a-z]+;/gi, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function now(): string {
	return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// ── Region classification ─────────────────────────────────────────────────────
// Edit INDIA_SIGNALS to add / remove cities. Matching is case-insensitive substring.
const INDIA_SIGNALS: string[] = [
	'india', 'bengaluru', 'bangalore', 'mumbai', 'delhi', 'new delhi',
	'hyderabad', 'pune', 'chennai', 'gurgaon', 'gurugram', 'noida', 'kolkata',
];

export function classifyRegion(location: string | null | undefined): 'india' | 'global' | 'unknown' {
	if (!location || location.trim() === '') return 'unknown';
	const loc = location.toLowerCase();
	if (INDIA_SIGNALS.some((s) => loc.includes(s))) return 'india';
	return 'global'; // non-empty, non-India → global
}
