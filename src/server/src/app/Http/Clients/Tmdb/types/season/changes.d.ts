export interface SeasonChanges {
	changes: SeasonChange[];
}

export interface SeasonChange {
	key: string;
	items: ChangeItem[];
}

interface ChangeItem {
	id: string;
	action: string;
	time: string;
	value: {
		episode_id: number;
		episode_number: number;
	};
	iso_639_1: string;
}
