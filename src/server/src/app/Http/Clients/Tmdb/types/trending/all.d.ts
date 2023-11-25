import { PaginatedResponse } from '../helpers';
import { Movie } from '../movie/movie';
import { Person } from '../people/person';
import { TvShow } from '../tv/tv';

export type TrendingCombined = PaginatedResponse<TvShow | Movie | Person>;
