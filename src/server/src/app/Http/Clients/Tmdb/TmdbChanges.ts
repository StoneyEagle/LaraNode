
import moment from "moment";
import TmdbClient from "./TmdbClient";
import { MovieChange, MovieChanges } from "./types/changes/movie";
import { TvShowChange, TvShowChanges } from "./types/changes/tv";
import { PeopleChange, PeopleChanges } from "./types/changes/people";

interface TmdbChangesInterface {
    language?: string;
}

/**
 * Represents a Changes from The Movie Database (TMDb).
 */
class TmdbChanges extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbChangesInterface} [options] - The options to initialize the TmdbChanges instance with.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ language = i18next.language }: TmdbChangesInterface = { language: i18next.language }) {
        super({ language });
    }
    
    protected async _movie(daysBack: number = 1): Promise<MovieChange[]> {
        TmdbClient.info(`Fetching Movie Changes for ${daysBack} days back`);

        if (daysBack > 14) {
            daysBack = 14;
        }

        const params = {
            params: {
                start_date: moment()
                    .subtract(daysBack, 'days')
                    .format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD'),
            },
        };

        const { data } = await this.get<MovieChanges>(`movie/changes`, params);

        return data.results;
    };

    public async movie(daysBack: number = 1): Promise<MovieChange[]> {
        TmdbClient.info('Fetching Movie Changes');

        return TmdbClient.paginatedResponse<TmdbChanges, MovieChange>(this, '_movie', daysBack);
    };

    protected async _person(daysBack: number = 1): Promise<PeopleChange[]> {
        TmdbClient.info(`Fetching People Changes for ${daysBack} days back`);

        if (daysBack > 14) {
            daysBack = 14;
        }

        const params = {
            params: {
                start_date: moment()
                    .subtract(daysBack, 'days')
                    .format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD'),
            },
        };

        const { data } = await this.get<PeopleChanges>(`person/changes`, params);

        return data.results;
    }

    public async person(daysBack: number = 1): Promise<PeopleChange[]> {
        TmdbClient.info('Fetching People Changes');

        return TmdbClient.paginatedResponse<TmdbChanges, PeopleChange>(this, '_person', daysBack);
    }
    
    protected async _tv(daysBack: number = 1): Promise<TvShowChange[]> {
        TmdbClient.info(`Fetching TV Show Changes for ${daysBack} days back`);

        if (daysBack > 14) {
            daysBack = 14;
        }

        const params = {
            params: {
                start_date: moment()
                    .subtract(daysBack, 'days')
                    .format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD'),
            },
        };

        const { data } = await this.get<TvShowChanges>(`tv/changes`, params);

        return data.results;
    };

    public async tv(daysBack: number = 1): Promise<TvShowChange[]> {
        TmdbClient.info('Fetching TvShow Changes');

        return TmdbClient.paginatedResponse<TmdbChanges, TvShowChange>(this, '_tv', daysBack);
    };
};

export default TmdbChanges;