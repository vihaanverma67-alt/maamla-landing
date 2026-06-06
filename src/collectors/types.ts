export interface SourceRow {
	id: number;
	ats_type: 'greenhouse' | 'lever' | 'rss';
	token: string;
	label: string;
	event_type: string | null;
	active: number;
	added_at: string;
}

export interface CollectorResult {
	fetched: number;
	kept: number;
	inserted: number;
	skipped: number;
	error?: string;
}

export interface PerSourceResult extends CollectorResult {
	source_id: number;
	ats_type: string;
	token: string;
	label: string;
}

export interface RunResult {
	perSource: PerSourceResult[];
	totals: {
		fetched: number;
		kept: number;
		inserted: number;
		skipped: number;
	};
}
