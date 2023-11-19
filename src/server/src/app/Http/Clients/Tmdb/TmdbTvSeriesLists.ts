import TmdbClient from "./TmdbClient";

import type { PaginatedResponse } from "./types/helpers";
import type { TvShow } from "./types/tv/tv";

interface TmdbTvSeriesListsInterface {
    language?: string;
}

/**
 * Represents TV Series from The Movie Database (TMDb).
 */
class TmdbTvSeriesLists extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbTvSeriesListsInterface} [options] - The options to initialize the TmdbTvSeriesLists instance with.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ language = i18next.language }: TmdbTvSeriesListsInterface = { language: i18next.language }) {
        super({ language });

        this.url = `tv`;
    }

    /**
     * Fetches a paginated list of TV shows that are currently on the air.
     * @param page The page number to fetch.
     * @returns A promise that resolves to a paginated response of TV shows.
     */
    protected async _onTheAir({ page = 1 }: { page?: number } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching Now Airing TV Shows page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/on_the_air`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of currently playing Tv Shows from TMDb API.
     * @param limit - The maximum number of Tv Shows to fetch. Defaults to 10.
     * @returns A promise that resolves to an array of Tv objects.
     */
    public async onTheAir({ limit = 10 }: { limit?: number } = {}) {
        TmdbClient.info('Fetching Now Airing TV Shows');

        return TmdbClient.paginatedResponse<TmdbTvSeriesLists, TvShow>(this, '_onTheAir', limit);
    };

    /**
     * Fetches a paginated list of popular TV shows from TMDb.
     * @param {Object} options - The options for the request.
     * @param {number} options.page - The page number to fetch.
     * @returns {Promise<PaginatedResponse<TvShow>>} A promise that resolves to a paginated response of TV shows.
     */
    protected async _popular({ page = 1 }: { page?: number } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching Popular TV Shows page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/popular`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches popular Tv Shows from TMDb API.
     * @param limit - The maximum number of Tv Shows to fetch. Defaults to 10.
     * @returns An array of popular Tv Shows.
     */
    public popular({ limit = 10 }: { limit?: number } = {}) {
        TmdbClient.info('Fetching Popular TV Shows');

        return TmdbClient.paginatedResponse<TmdbTvSeriesLists, TvShow>(this, '_popular', limit);
    };

    /**
     * Fetches a paginated list of top rated TV shows from TMDb API.
     * @param {number} page - The page number to fetch.
     * @returns {Promise<PaginatedResponse<TvShow>>} A promise that resolves to a paginated response of TV shows.
     */
    protected async _topRated({ page = 1 }: { page?: number } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching Top Rated TV Shows page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/top_rated`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches the top rated Tv Shows from TMDb API.
     * @param limit - The maximum number of Tv Shows to fetch. Defaults to 10.
     * @returns An array of TvShow objects representing the top rated Tv Shows.
     */
    public async topRated({ limit = 10 }: { limit?: number } = {}) {
        TmdbClient.info('Fetching Top Rated TV Shows');

        return TmdbClient.paginatedResponse<TmdbTvSeriesLists, TvShow>(this, '_topRated', limit);
    };

    /**
     * Fetches a paginated list of Today Airing TV shows.
     * @param page - The page number to fetch. Defaults to 1.
     * @returns A promise that resolves to a paginated response of TV shows.
     */
    protected async _airingToday({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching Today Airing TV Shows page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/airing_today`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of Today Airing Tv Shows from the TMDb API.
     * @param limit The maximum number of Tv Shows to fetch (default: 10).
     * @returns A Promise that resolves to an array of TvShow objects.
     */
    public async airingToday({ limit = 10 }: { limit?: number } = {}) {
        TmdbClient.info('Fetching Today Airing TV Shows');

        return TmdbClient.paginatedResponse<TmdbTvSeriesLists, TvShow>(this, '_airingToday', limit);
    };

}

export default TmdbTvSeriesLists;