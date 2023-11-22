import { Season } from './season';

export interface SeasonTopRated {
	page: number;
	results: Season[];
	total_pages: number;
	total_results: number;
}
