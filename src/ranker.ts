// ─── Scoring weights — edit these to tune the ranker ────────────────────────
// Positive weights for internships sum to 100; certificates add a skill weight
// on top (clamped to 100 by Math.min at the end).
const WEIGHTS = {
	earlyCareer:   40,  // title/desc contains intern/entry/junior/graduate etc.
	interest:      25,  // title/desc overlaps CS & tech interest buckets
	location:      20,  // location field mentions a target location
	typePriority:  15,  // opportunity type alignment with the priorities list
	skill:         20,  // profile skill matches certificate topic (certs only)
	seniority:    -30,  // PENALTY: title signals senior/lead/staff/experienced
} as const;

// Early-career signals — checked against title + description
const EARLY_CAREER_RE =
	/\b(intern(ship)?|graduate|entry.?level|junior|trainee|no\s+experience|first.?year|sophomore|new\s+grad)\b/i;

// Seniority signals that flag overqualification — title only, not description
// (descriptions often mention "senior leadership" without the role being senior)
const SENIOR_RE =
	/\b(senior|staff|principal|manager|director|lead\s+(engineer|developer)|5\+\s*years?|10\+\s*years?|experienced\s+(engineer|developer))\b/i;

// Four disjoint interest buckets. Each bucket hit = 1/4 of WEIGHTS.interest.
const INTEREST_BUCKETS: RegExp[] = [
	// Bucket 1: core CS / software
	/computer\s*science|\bcs\b|software\s*(engineer|developer|development)|coding|programming|algorithm/i,
	// Bucket 2: data / AI / ML
	/\bdata\b|analytics|machine\s+learning|\bml\b|artificial\s+intelligence|\bai\b|llm|deep\s+learning/i,
	// Bucket 3: technology / platforms / infra
	/\btech\b|technology|cloud|devops|security|cybersecurity|backend|frontend|full.?stack|platform|infrastructure/i,
	// Bucket 4: social impact / community (matches "Social work" interest + NGO/volunteering roles)
	/social\s+(work|impact)|\bvolunteer(ing)?\b|community\s+(service|impact|development|education)|human\s+rights|sustainability|environmental|\bngo\b|nonprofit|welfare|humanitarian|civic\s+tech/i,
];

// Profile skill → certificate topic keyword mapping (certificates only)
const SKILL_CERT_BUCKETS: Array<[string[], RegExp]> = [
	[['Programming'], /programming|coding|software|algorithm|development|python|javascript|java|web|backend|frontend|sql|node/i],
	[['Research'], /research|data\s*science|analytics|machine\s+learning|statistics|analysis|jupyter|pandas/i],
	[['Design'], /ux|user\s+experience|ui\s+design|prototype|figma|design/i],
	[['Leadership'], /project\s+management|leadership|agile|scrum|management/i],
	[['Writing'], /writing|content|documentation|technical\s+writing/i],
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityForRanking {
	type: string;
	title: string;
	description: string | null;
	location: string | null;
	region?: string;  // 'india' | 'global' | 'unknown'
}

export interface ProfileForRanking {
	target_locations: string[];
	priorities: string[];  // ordered list of opportunity types, highest priority first
	skills?: string[];     // profile skill chips, used for certificate matching
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
	// "Online" matches "remote"; region field used as fallback for city-list locations.
	const locationHit = profile.target_locations.some((tl) => {
		const t = tl.toLowerCase();
		if (t === 'remote') return locText.includes('remote') || locText.includes('anywhere') || locText.includes('work from home') || locText.includes('online');
		if (t === 'global') return locText.includes('global') || locText.includes('worldwide');
		if (t === 'india') return locText.includes('india') || opp.region === 'india';
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

	// ── Skill match (certificates only) ──────────────────────────────────────
	// Check if any of the user's profile skills maps to this certificate's topic.
	if (opp.type === 'certificate' && profile.skills && profile.skills.length > 0) {
		const skillHit = SKILL_CERT_BUCKETS.some(
			([skillNames, re]) => skillNames.some((s) => profile.skills!.includes(s)) && re.test(fullText),
		);
		if (skillHit) {
			raw += WEIGHTS.skill;
			reasons.push('skill match');
		}
	}

	const score = Math.min(100, Math.max(0, Math.round(raw)));
	const fit_reason = reasons.length > 0 ? reasons.join(' + ') : 'no strong signal';

	return { score, fit_reason };
}
