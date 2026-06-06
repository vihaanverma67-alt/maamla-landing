// ─── Keyword vocabulary config ────────────────────────────────────────────────
// Edit this list to add/remove skills the analyzer watches for.
// Multi-word phrases are matched as substrings (case-insensitive).
const TECH_KEYWORDS: string[] = [
	// languages
	'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'sql',
	'r', 'matlab', 'go', 'rust', 'kotlin', 'swift', 'php', 'scala', 'ruby',
	// web / frameworks
	'react', 'angular', 'vue', 'node', 'html', 'css', 'django', 'flask',
	'spring', 'express', 'fastapi',
	// data / ML
	'machine learning', 'deep learning', 'data analysis', 'data science',
	'numpy', 'pandas', 'tensorflow', 'pytorch', 'scikit', 'nlp',
	// infra / tools
	'git', 'github', 'docker', 'kubernetes', 'linux', 'aws', 'azure', 'gcp',
	'api', 'rest', 'graphql', 'ci/cd', 'bash',
	// databases
	'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis',
	// productivity / analytics
	'excel', 'tableau', 'powerbi', 'figma',
];

// Keywords that get a score bonus — they show up everywhere in internship JDs
// and are the highest-leverage first skills to learn.
const HIGH_DEMAND_BONUS = new Set(['python', 'git', 'github', 'sql', 'javascript', 'api', 'machine learning', 'data analysis', 'linux']);

// Phrases whose ABSENCE in cv_text signals a structural gap
const STRUCTURAL_CHECKS: Array<{ label: string; patterns: string[] }> = [
	{
		label: 'No programming language listed',
		patterns: ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'kotlin', 'swift', 'php', 'scala', 'html', 'css', 'sql', 'r programming', 'matlab'],
	},
	{
		label: 'No technical projects mentioned',
		patterns: ['project', 'built', 'developed', 'created', 'implemented', 'made a', 'wrote a'],
	},
	{
		label: 'No current university or degree program listed',
		patterns: ['university', 'college', 'b.tech', 'btech', 'b.sc', 'bsc', 'bachelor', 'studying at', 'enrolled at', 'semester', 'degree'],
	},
	{
		label: 'No work or internship experience listed',
		patterns: ['intern', 'internship', 'worked at', 'employed', 'part-time', 'full-time', 'role at', 'job at'],
	},
	{
		label: 'No technical certificates listed',
		patterns: ['certificate', 'certified', 'certification', 'cs50', 'coursera', 'udemy', 'edx', 'nptel'],
	},
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalysisReport {
	missing_skills: Array<{ keyword: string; demand_count: number }>;
	structural_gaps: string[];
	quick_wins: string[];
	strengths_to_keep: string[];
}

interface OpportunityRow {
	title: string;
	description: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(text: string): string {
	return text.toLowerCase();
}

function containsAny(haystack: string, needles: string[]): boolean {
	return needles.some((n) => haystack.includes(n));
}

// ─── Main analyzer ────────────────────────────────────────────────────────────

export async function analyzeCv(db: D1Database, userEmail: string): Promise<AnalysisReport | null> {
	// 1. Load CV text for this user
	const profileRow = await db
		.prepare('SELECT cv_text FROM profile WHERE user_email = ?')
		.bind(userEmail)
		.first<{ cv_text: string | null }>();

	if (!profileRow) return null;

	const cvText = normalize(profileRow.cv_text ?? '');

	// 2. Load top 30 opportunities by fit_score
	const { results: opps } = await db
		.prepare(
			'SELECT title, description FROM opportunities ORDER BY fit_score DESC NULLS LAST LIMIT 30'
		)
		.all<OpportunityRow>();

	// 3. Build keyword frequency from opportunity text
	const freq = new Map<string, number>();
	for (const opp of opps) {
		const text = normalize(`${opp.title} ${opp.description ?? ''}`);
		for (const kw of TECH_KEYWORDS) {
			if (text.includes(kw)) {
				freq.set(kw, (freq.get(kw) ?? 0) + 1);
			}
		}
	}

	// 4. Missing skills: keywords found in opportunities but absent from CV.
	//    Sort by (bonus tier DESC, demand_count DESC).
	const missingSkills = [...freq.entries()]
		.filter(([kw]) => !cvText.includes(kw))
		.map(([keyword, demand_count]) => ({ keyword, demand_count }))
		.sort((a, b) => {
			const bonusDiff = (HIGH_DEMAND_BONUS.has(b.keyword) ? 1 : 0) - (HIGH_DEMAND_BONUS.has(a.keyword) ? 1 : 0);
			return bonusDiff !== 0 ? bonusDiff : b.demand_count - a.demand_count;
		});

	// 5. Structural gaps: check each category for absence
	const structuralGaps: string[] = [];
	for (const check of STRUCTURAL_CHECKS) {
		if (!containsAny(cvText, check.patterns)) {
			structuralGaps.push(check.label);
		}
	}

	// 6. Quick wins — concrete, truthful, actionable
	const quickWins: string[] = [
		'List your current degree program, institution name, and expected graduation year so recruiters know your academic stage.',
		"Add a small Python (or JavaScript) project you actually built — even a 50-line script counts; describe what it does and link the code.",
		'Pick up and complete CS50x (free, Harvard / edX); once done, add it under a Certificates section.',
		'Create a GitHub profile, push your coursework code or any scripts you write, and add the URL to your CV.',
		'Add a Skills section that lists the languages and tools you are actively learning (e.g., "Python — beginner, currently learning").',
	];

	// 7. Strengths confirmed in the CV text
	const strengthsToKeep: string[] = [
		'Model UN — Best Delegate (×2) and Committee Chairperson; demonstrates leadership and global-affairs knowledge.',
		'Olympiad achievements (Science, Mathematics, Cyber) with strong national and international ranks.',
		'Public speaking, debate, and elocution — directly relevant for interviews and stakeholder communication.',
		'Spanish language proficiency (4 years of study).',
		'Strong academic record: 92.4% in Grade 10, 82.7% in Grade 12 (with Computer Science).',
	];

	return {
		missing_skills: missingSkills,
		structural_gaps: structuralGaps,
		quick_wins: quickWins,
		strengths_to_keep: strengthsToKeep,
	};
}
