import { PaginatedResponse } from "../helpers";

export interface MovieChange {
    id: number;
    adult: boolean;
}

export type MovieChanges = PaginatedResponse<MovieChange>;