// ── Keyword vocabulary ────────────────────────────────────────────────────────
// Edit to add / remove keywords the suggestion engine watches for.
// Mirror any changes here in cv-analyzer.ts as well.
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
	// analytics / design
	'excel', 'tableau', 'powerbi', 'figma',
];

// Skills that always generate a suggestion if missing from the CV.
const HIGH_DEMAND = new Set([
	'python', 'git', 'github', 'sql', 'javascript', 'api', 'machine learning', 'data analysis', 'linux',
]);

// ── Structural checks ─────────────────────────────────────────────────────────
// Each check fires if NONE of its patterns appear in the CV text (lowercase).
// Edit 'suggestion' to change the template text that gets inserted on Accept.
const STRUCTURAL_CHECKS: Array<{
	id: string;
	patterns: string[];
	target: string;
	suggestion: string;
	rationale: string;
}> = [
	{
		id: 'gap-lang',
		patterns: [
			'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go',
			'rust', 'kotlin', 'swift', 'php', 'scala', 'html', 'css', 'sql', 'r programming', 'matlab',
		],
		target: 'Skills / Programming section',
		suggestion: 'Skills\nProgramming: Python (learning), JavaScript (learning)\nTools: Git, GitHub\n\n(Replace the examples with the languages you are actually learning.)',
		rationale: 'No programming language is visible on your CV. Listing even one language you are actively learning signals direction to recruiters.',
	},
	{
		id: 'gap-projects',
		patterns: ['project', 'built', 'developed', 'created', 'implemented', 'made a', 'wrote a'],
		target: 'Projects section',
		suggestion: 'Projects\n• [Project title] — [One sentence: what it does and the technology]\n  GitHub: github.com/[yourhandle]/[repository]\n\n(Any script or coursework you have written qualifies — even 50 lines.)',
		rationale: 'No project is mentioned. Recruiters weight projects heavily when work experience is limited.',
	},
	{
		id: 'gap-edu',
		patterns: [
			'university', 'college', 'b.tech', 'btech', 'b.sc', 'bsc', 'bachelor',
			'studying at', 'enrolled at', 'semester', 'degree',
		],
		target: 'Education section',
		suggestion: 'Education\n• [Degree, e.g. B.Tech Computer Science], [University / College Name], [City]\n  Started: [Month Year]   Expected graduation: [Month Year]\n\n(Replace the brackets with your actual details.)',
		rationale: 'Your CV mentions undergraduate study but does not name the degree program or institution. Recruiters need both.',
	},
	{
		id: 'gap-experience',
		patterns: ['intern', 'internship', 'worked at', 'employed', 'part-time', 'full-time', 'role at', 'job at'],
		target: 'Experience section',
		suggestion: 'Experience (if applicable)\n• [Role, e.g. Volunteer / Tutor / Club Officer], [Organisation], [Duration]\n  - [One bullet: what you did and what you gained from it]\n\n(Tutoring, event volunteering, and school-club officer roles all count.)',
		rationale: 'No work or internship experience is listed. Even informal roles demonstrate initiative.',
	},
	{
		id: 'gap-certs',
		patterns: ['certificate', 'certified', 'certification', 'cs50', 'coursera', 'udemy', 'edx', 'nptel'],
		target: 'Certifications section',
		suggestion: 'Certifications\n• [Certificate name], [Platform], [Year]\n  (e.g. CS50x — Introduction to Computer Science, edX / Harvard, 2025)\n\n(CS50x is free and widely recognised — consider completing it.)',
		rationale: 'No certificate is listed. Free credentials from edX, Coursera, or NPTEL are explicitly accepted in many listings.',
	},
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CvSuggestion {
	id: string;
	type: 'add_skill' | 'add_section';
	target: string;
	suggestion: string; // text appended to the textarea on Accept
	rationale: string;
}

// ── Generator ─────────────────────────────────────────────────────────────────

interface OppRow { title: string; description: string | null }

export async function generateSuggestions(db: D1Database, userEmail: string): Promise<CvSuggestion[] | null> {
	// 1. Load CV text for this user
	const profileRow = await db
		.prepare('SELECT cv_text FROM profile WHERE user_email = ?')
		.bind(userEmail)
		.first<{ cv_text: string | null }>();

	if (!profileRow) return null;

	const cvText = (profileRow.cv_text ?? '').toLowerCase();

	// 2. Load top 30 opportunities (for keyword frequency)
	const { results: opps } = await db
		.prepare('SELECT title, description FROM opportunities ORDER BY fit_score DESC NULLS LAST LIMIT 30')
		.all<OppRow>();

	// 3. Build keyword frequency from opportunity text
	const freq = new Map<string, number>();
	for (const opp of opps) {
		const text = `${opp.title} ${opp.description ?? ''}`.toLowerCase();
		for (const kw of TECH_KEYWORDS) {
			if (text.includes(kw)) freq.set(kw, (freq.get(kw) ?? 0) + 1);
		}
	}

	const suggestions: CvSuggestion[] = [];

	// 4. Skill suggestions — missing keywords with demand_count >= 2 or in HIGH_DEMAND
	const missingSkills = [...freq.entries()]
		.filter(([kw, count]) => !cvText.includes(kw) && (HIGH_DEMAND.has(kw) || count >= 2))
		.sort((a, b) => {
			const bd = (HIGH_DEMAND.has(b[0]) ? 1 : 0) - (HIGH_DEMAND.has(a[0]) ? 1 : 0);
			return bd !== 0 ? bd : b[1] - a[1];
		})
		.slice(0, 5);

	for (const [kw, count] of missingSkills) {
		const label = kw.charAt(0).toUpperCase() + kw.slice(1);
		suggestions.push({
			id: `skill-${kw.replace(/[\s/]+/g, '-')}`,
			type: 'add_skill',
			target: 'Skills section',
			suggestion: `• ${label} — learning\n(Add this line to your Skills / Programming section.)`,
			rationale: `"${kw}" appears in ${count} of your top-matched listings. Adding it — even as "learning" — signals awareness.`,
		});
	}

	// 5. Structural gap suggestions — each check that fires adds one suggestion
	for (const check of STRUCTURAL_CHECKS) {
		if (!check.patterns.some((p) => cvText.includes(p))) {
			suggestions.push({
				id: check.id,
				type: 'add_section',
				target: check.target,
				suggestion: check.suggestion,
				rationale: check.rationale,
			});
		}
	}

	return suggestions;
}
