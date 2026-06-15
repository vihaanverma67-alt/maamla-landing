import { SourceRow, PerSourceResult, RunResult } from './types';
import { collectGreenhouse } from './greenhouse';
import { collectLever } from './lever';
import { collectRss } from './rss';
import { collectConfstech } from './confstech';
import { collectCertificates } from './certificates';
import { collectNgos } from './ngos';

export async function runAllSources(db: D1Database): Promise<RunResult> {
	const { results: sources } = await db.prepare('SELECT * FROM sources WHERE active = 1').all<SourceRow>();

	const perSource: PerSourceResult[] = [];
	const totals = { fetched: 0, kept: 0, inserted: 0, skipped: 0 };

	for (const source of sources) {
		let result;
		try {
			if (source.ats_type === 'greenhouse') {
				result = await collectGreenhouse(source.token, source.label, db);
			} else if (source.ats_type === 'lever') {
				result = await collectLever(source.token, source.label, db);
			} else if (source.ats_type === 'rss') {
				result = await collectRss(source.token, source.label, source.event_type, db);
			} else {
				result = { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: `Unknown ats_type: ${source.ats_type}` };
			}
		} catch (err) {
			result = { fetched: 0, kept: 0, inserted: 0, skipped: 0, error: String(err) };
		}

		perSource.push({ source_id: source.id, ats_type: source.ats_type, token: source.token, label: source.label, ...result });
		totals.fetched += result.fetched;
		totals.kept += result.kept;
		totals.inserted += result.inserted;
		totals.skipped += result.skipped;
	}

	// confstech runs unconditionally — no sources row needed; config lives in confstech.ts
	try {
		const confsResult = await collectConfstech(db);
		perSource.push({ source_id: 0, ats_type: 'confstech', token: '', label: 'confs.tech', ...confsResult });
		totals.fetched += confsResult.fetched;
		totals.kept += confsResult.kept;
		totals.inserted += confsResult.inserted;
		totals.skipped += confsResult.skipped;
	} catch (err) {
		perSource.push({ source_id: 0, ats_type: 'confstech', token: '', label: 'confs.tech', fetched: 0, kept: 0, inserted: 0, skipped: 0, error: String(err) });
	}

	// certificates runs unconditionally — static curated catalog
	try {
		const certResult = await collectCertificates(db);
		perSource.push({ source_id: 0, ats_type: 'curated', token: '', label: 'certificates', ...certResult });
		totals.fetched += certResult.fetched;
		totals.kept += certResult.kept;
		totals.inserted += certResult.inserted;
		totals.skipped += certResult.skipped;
	} catch (err) {
		perSource.push({ source_id: 0, ats_type: 'curated', token: '', label: 'certificates', fetched: 0, kept: 0, inserted: 0, skipped: 0, error: String(err) });
	}

	// ngos runs unconditionally — static curated catalog
	try {
		const ngoResult = await collectNgos(db);
		perSource.push({ source_id: 0, ats_type: 'curated', token: '', label: 'ngos', ...ngoResult });
		totals.fetched += ngoResult.fetched;
		totals.kept += ngoResult.kept;
		totals.inserted += ngoResult.inserted;
		totals.skipped += ngoResult.skipped;
	} catch (err) {
		perSource.push({ source_id: 0, ats_type: 'curated', token: '', label: 'ngos', fetched: 0, kept: 0, inserted: 0, skipped: 0, error: String(err) });
	}

	return { perSource, totals };
}
