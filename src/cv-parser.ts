import { unzipSync, decompressSync } from 'fflate';

// ── TXT ──────────────────────────────────────────────────────────────────────

function parseTxt(buffer: ArrayBuffer): string {
	return new TextDecoder().decode(buffer);
}

// ── DOCX ─────────────────────────────────────────────────────────────────────

function parseDocx(buffer: ArrayBuffer): string {
	try {
		const zip = unzipSync(new Uint8Array(buffer));
		const xmlBytes = zip['word/document.xml'];
		if (!xmlBytes) return '';
		const xml = new TextDecoder().decode(xmlBytes);
		return xml
			.replace(/<w:br[^>]*>/g, '\n')
			.replace(/<\/w:p>/g, '\n')
			.replace(/<[^>]+>/g, '')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&apos;/g, "'")
			.replace(/&quot;/g, '"')
			.replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
			.replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(parseInt(d, 10)))
			.replace(/\n{3,}/g, '\n\n')
			.trim();
	} catch {
		return '';
	}
}

// ── PDF ───────────────────────────────────────────────────────────────────────

function decodePdfStr(s: string): string {
	return s
		.replace(/\\n/g, ' ')
		.replace(/\\r/g, ' ')
		.replace(/\\t/g, ' ')
		.replace(/\\\(/g, '(')
		.replace(/\\\)/g, ')')
		.replace(/\\\\/g, '\\')
		.replace(/\\([0-7]{3})/g, (_: string, oct: string) => String.fromCharCode(parseInt(oct, 8)));
}

function extractBtEt(content: string, parts: string[]): void {
	const BT_ET = /BT\b([\s\S]*?)\bET\b/g;
	let bm: RegExpExecArray | null;
	while ((bm = BT_ET.exec(content)) !== null) {
		const block = bm[1];
		const TJ1 = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
		let m: RegExpExecArray | null;
		while ((m = TJ1.exec(block)) !== null) parts.push(decodePdfStr(m[1]));

		const TJA = /\[([\s\S]*?)\]\s*TJ/g;
		while ((m = TJA.exec(block)) !== null) {
			const STR = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
			let sm: RegExpExecArray | null;
			while ((sm = STR.exec(m[1])) !== null) parts.push(decodePdfStr(sm[1]));
		}
		if (/\bT[dD*]\b/.test(block)) parts.push('\n');
	}
}

function parsePdf(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const src = new TextDecoder('latin1').decode(bytes);
	const parts: string[] = [];

	let pos = 0;
	while (pos < src.length) {
		const sIdx = src.indexOf('stream', pos);
		if (sIdx < 0) break;

		const dict = src.slice(Math.max(0, sIdx - 300), sIdx);
		const usesFlate = /\/FlateDecode|\/Fl[ \/>]/.test(dict);

		let dataStart = sIdx + 6;
		if (src[dataStart] === '\r') dataStart++;
		if (src[dataStart] === '\n') dataStart++;

		const eIdx = src.indexOf('endstream', dataStart);
		if (eIdx < 0) break;

		const streamBytes = bytes.slice(dataStart, eIdx);
		let content = '';

		if (usesFlate && streamBytes.length > 4) {
			try {
				content = new TextDecoder('latin1').decode(decompressSync(streamBytes));
			} catch {
				// not a valid zlib stream; skip
			}
		} else if (!usesFlate) {
			content = new TextDecoder('latin1').decode(streamBytes);
		}

		if (content) extractBtEt(content, parts);

		pos = eIdx + 9;
	}

	return parts
		.join(' ')
		.replace(/ {2,}/g, ' ')
		.replace(/ \n /g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

// ── Detection ─────────────────────────────────────────────────────────────────

export function detectFromText(text: string): {
	name: string | null;
	stage: string | null;
	skills: string[];
} {
	const lower = text.toLowerCase();

	// Name: first non-empty line that plausibly looks like a person's name
	const firstLine = text.split('\n').find((l) => l.trim().length > 1)?.trim() ?? null;
	const name =
		firstLine &&
		firstLine.length < 60 &&
		!/\d{4,}/.test(firstLine) &&
		!/^(curriculum|resume|cv\b|profile|contact|summary|objective|education|skills)/i.test(firstLine)
			? firstLine
			: null;

	// Stage
	let stage: string | null = null;
	if (
		/\b(b\.?tech|bachelor|undergraduate|b\.?sc|b\.?com|b\.?a\b|bba|b\.?e\b|first year|second year|third year|final year|pursuing|engineering student)\b/.test(
			lower,
		)
	) {
		stage = 'Undergraduate';
	} else if (/\b(m\.?tech|master|mba|m\.?sc|m\.?a\b|phd|ph\.d|postgraduate|graduate student)\b/.test(lower)) {
		stage = 'Graduate';
	} else if (
		/\b(class (xii|xi|x|12|11|10)\b|cbse|icse|ib diploma|a.levels|high school|secondary school)\b/.test(lower)
	) {
		stage = 'School student';
	}

	// Skills — map keywords to OB_SKILLS chip values
	const skillMap: Array<[RegExp, string]> = [
		[
			/\b(python|javascript|typescript|java\b|c\+\+|c#|react|angular|vue|node|html|css|sql|git|coding|programming|software|algorithm|machine learning|deep learning)\b/,
			'Programming',
		],
		[/\b(research|literature review|publications?|thesis|peer.reviewed)\b/, 'Research'],
		[/\b(design|figma|sketch|photoshop|illustrator|\bui\b|\bux\b|graphic|visual design)\b/, 'Design'],
		[/\b(lead|leadership|president|head of|captain|founded|co.founded|coordinated)\b/, 'Leadership'],
		[
			/\b(french|spanish|german|mandarin|japanese|arabic|bilingual|multilingual|ielts|toefl|language proficiency)\b/,
			'Languages',
		],
		[/\b(mun|model united nations|debate|debating|oratory|elocution|public speaking)\b/, 'Debate & MUN'],
		[/\b(cricket|football|basketball|tennis|swimming|badminton|athlete|national level|state level|district level)\b/, 'Sports'],
		[/\b(writ(ing|er|ten)|blog|content creation|editorial|journalism|copywrite|newsletter)\b/, 'Writing'],
	];

	const skills: string[] = [];
	for (const [re, skill] of skillMap) {
		if (re.test(lower)) skills.push(skill);
	}

	return { name, stage, skills };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function parseCv(
	buffer: ArrayBuffer,
	filename: string,
): { text: string; warning: string | null } {
	const lname = filename.toLowerCase();
	let text = '';
	let warning: string | null = null;

	if (lname.endsWith('.txt')) {
		text = parseTxt(buffer);
	} else if (lname.endsWith('.docx')) {
		text = parseDocx(buffer);
		if (!text) warning = 'Could not read text from this file. Paste your CV below.';
	} else if (lname.endsWith('.pdf')) {
		text = parsePdf(buffer);
		if (text.length < 80) {
			text = '';
			warning = 'Could not extract text from this PDF — it may be scanned or encrypted. Paste your CV below.';
		}
	}

	return { text, warning };
}
