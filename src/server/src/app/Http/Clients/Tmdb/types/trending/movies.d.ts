import { PaginatedResponse } from '../helpers';
import { Movie } from '../movie/movie';

export type TrendingMovies = PaginatedResponse<Movie>;
