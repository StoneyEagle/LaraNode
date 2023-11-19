export interface EpisodeAccountStates {
	id: number;
	favorite: boolean;
	rated: Rated | boolean;
	watchlist: boolean;
}

interface Rated {
	value: boolean;
}
