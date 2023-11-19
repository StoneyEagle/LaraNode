import { PaginatedResponse } from "../helpers";

export interface TvShowChange {
    id: number;
    adult: boolean;
}

export type TvShowChanges = PaginatedResponse<TvShowChange>;