
export interface TvChanges {
	changes: TvChange[];
}

export interface TvChange {
	key: string;
	items: TvChangeItem[];
}

interface TvChangeItem {
	id: string;
	action: string;
	time: string;
	iso_639_1: string,
	iso_3166_1: string,
	// TODO: Fix this fuckit!
	value: any;
	original_value: any;
}
