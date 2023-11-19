

import TmdbClient from "./TmdbClient";
import type { Person } from "./types/people/person";
import type { PaginatedResponse } from "./types/helpers";

interface TmdbPeopleListsInterface {
    language?: string;
}

/**
 * Represents People Lists from The Movie Database (TMDb).
 */
class TmdbPeopleLists extends TmdbClient {

    constructor({ language = i18next.language }: TmdbPeopleListsInterface = { language: i18next.language }) {
        super({ language });

        this.url = `person`;
    }

    async _popular({ page = 1 }): Promise<PaginatedResponse<Person>> {
        TmdbClient.info(`Fetching Popular People page ${page}`);

        const { data } = await this.get<PaginatedResponse<Person>>('person/popular', {
            params: {
                page: page,
                language: this.language,
            },
        });

        return data;
    }

    public async popular({ limit = 10 }: { limit?: number, language?: string; } = {}): Promise<Person[]> {
        TmdbClient.info('Fetching Popular People');

        return await TmdbClient.paginatedResponse<TmdbPeopleLists, Person>(this, '_popular', limit);
    };
}

export default TmdbPeopleLists;
