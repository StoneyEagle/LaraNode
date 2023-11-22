export interface EpisodeChanges {
	changes: EpisodeChange[];
}

export interface EpisodeChange {
	key: string;
	items: ChangeItem[];
}

interface ChangeItem {
	id: string;
	action: string;
	time: string;
	value: string;
	iso_639_1: string;
}
