import { PaginatedResponse } from "../helpers";

export interface PeopleChange {
    id: number;
    adult: boolean;
}

export type PeopleChanges = PaginatedResponse<PeopleChange>;