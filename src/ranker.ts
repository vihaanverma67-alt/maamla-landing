// ─── Scoring weights — edit these to tune the ranker ────────────────────────
// All positive weights sum to 100 so scores are already on a 0-100 scale
// before the seniority penalty. Clamp keeps the final value in [0, 100].
const WEIGHTS = {
	earlyCareer:   40,  // title/desc contains intern/entry/junior/graduate etc.
	interest:      25,  // title/desc overlaps CS & tech interest buckets
	location:      20,  // location field mentions a target location
	typePriority:  15,  // opportunity type alignment with the priorities list
	seniority:    -30,  // PENALTY: title signals senior/lead/staff/experienced
} as const;

// Early-career signals — checked against title + description
const EARLY_CAREER_RE =
	/\b(intern(ship)?|graduate|entry.?level|junior|trainee|no\s+experience|first.?year|sophomore|new\s+grad)\b/i;

// Seniority signals that flag overqualification — title only, not description
// (descriptions often mention "senior leadership" without the role being senior)
const SENIOR_RE =
	/\b(senior|staff|principal|manager|director|lead\s+(engineer|developer)|5\+\s*years?|10\+\s*years?|experienced\s+(engineer|developer))\b/i;

// Three disjoint interest buckets aligned with profile interests
// ["computer science", "technology"]. Each bucket hit = 1/3 of WEIGHTS.interest.
const INTEREST_BUCKETS: RegExp[] = [
	// Bucket 1: core CS / software
	/computer\s*science|\bcs\b|software\s*(engineer|developer|development)|coding|programming|algorithm/i,
	// Bucket 2: data / AI / ML
	/\bdata\b|analytics|machine\s+learning|\bml\b|artificial\s+intelligence|\bai\b|llm|deep\s+learning/i,
	// Bucket 3: technology / platforms / infra
	/\btech\b|technology|cloud|devops|security|cybersecurity|backend|frontend|full.?stack|platform|infrastructure/i,
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityForRanking {
	type: string;
	title: string;
	description: string | null;
	location: string | null;
}

export interface ProfileForRanking {
	target_locations: string[];
	priorities: string[];  // ordered list of opportunity types, highest priority first
}

export interface ScoreResult {
	score: number;       // integer 0-100
	fit_reason: string;  // human-readable summary of fired signals
}

// ─── Scorer ───────────────────────────────────────────────────────────────────

export function scoreOpportunity(opp: OpportunityForRanking, profile: ProfileForRanking): ScoreResult {
	const titleText  = opp.title;
	const fullText   = `${opp.title} ${opp.description ?? ''}`;
	const locText    = (opp.location ?? '').toLowerCase();
	const reasons: string[] = [];
	let raw = 0;

	// ── Early-career match ────────────────────────────────────────────────────
	if (EARLY_CAREER_RE.test(fullText)) {
		raw += WEIGHTS.earlyCareer;
		reasons.push('entry-level');
	}

	// ── Seniority penalty (title only) ────────────────────────────────────────
	if (SENIOR_RE.test(titleText)) {
		raw += WEIGHTS.seniority;  // negative
		reasons.push('senior (penalized)');
	}

	// ── Interest overlap ─────────────────────────────────────────────────────
	// Count how many of the three buckets fire; score scales proportionally.
	const bucketHits = INTEREST_BUCKETS.filter((re) => re.test(fullText)).length;
	if (bucketHits > 0) {
		raw += Math.round((bucketHits / INTEREST_BUCKETS.length) * WEIGHTS.interest);
		reasons.push('CS/tech');
	}

	// ── Location match ───────────────────────────────────────────────────────
	const locationHit = profile.target_locations.some((tl) => {
		const t = tl.toLowerCase();
		if (t === 'remote') return locText.includes('remote') || locText.includes('anywhere') || locText.includes('work from home');
		if (t === 'global') return locText.includes('global') || locText.includes('worldwide');
		return locText.includes(t);
	});
	if (locationHit) {
		raw += WEIGHTS.location;
		reasons.push('location match');
	}

	// ── Type priority ────────────────────────────────────────────────────────
	// Top-priority type gets full WEIGHTS.typePriority; each step down loses 1/n.
	const priorityIndex = profile.priorities.indexOf(opp.type);
	if (priorityIndex !== -1) {
		const n = profile.priorities.length;
		const pts = Math.round(((n - priorityIndex) / n) * WEIGHTS.typePriority);
		raw += pts;
		if (pts > 0) reasons.push(opp.type);
	}

	const score = Math.min(100, Math.max(0, Math.round(raw)));
	const fit_reason = reasons.length > 0 ? reasons.join(' + ') : 'no strong signal';

	return { score, fit_reason };
}
