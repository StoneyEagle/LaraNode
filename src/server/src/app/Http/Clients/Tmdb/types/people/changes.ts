export interface PeopleChanges {
	changes: PeopleChange[];
}

export interface PeopleChange {
	key: string;
	items: PeopleChangeItem[];
}

interface PeopleChangeItem {
	id: string;
	action: string;
	time: string;
	original_value: {
		profile: {
			file_path: string;
		};
	};
}
