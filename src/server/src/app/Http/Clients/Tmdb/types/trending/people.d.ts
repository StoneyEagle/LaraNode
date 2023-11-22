import { PaginatedResponse } from '../helpers';
import { Person } from '../people/person';

export type TrendingPeople = PaginatedResponse<Person>;
