
import TmdbClient from "./TmdbClient";
import type { DiscoverMovieParams } from "./types/discover/discover_movie";
import type { DiscoverTvShowParams } from "./types/discover/discover_tv";
import type { PaginatedResponse } from "./types/helpers";
import type { Movie } from "./types/movie/movie";
import type { TvShow } from "./types/tv/tv";

interface TmdbDiscoverInterface {
    language?: string;
}

/**
 * Represents Discover from The Movie Database (TMDb).
 */
class TmdbDiscover extends TmdbClient {

    constructor({ language = i18next.language }: TmdbDiscoverInterface = { language: i18next.language }) {
        super({ language });

        this.url = 'discover';
    }

    /**
     * Fetches a paginated list of movies based on the provided parameters.
     * @param params - The parameters to filter the movie results by.
     * @param page - The page number of the results to fetch.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async _movie({ params = {}, page = 1 }: { params?: DiscoverMovieParams, page: number; }): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Discover Movie page ${page} with params ${JSON.stringify(params)}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/movie`, {
            params: {
                page: page,
                ...params,
            },
        });

        return data;
    }
    /**
     * Fetches a list of movies based on the provided parameters.
     * @param params The parameters to use for the request.
     * @param limit The maximum number of movies to return. Defaults to 10.
     * @returns A Promise that resolves to an array of `Movie` objects.
     */
    public async movie({ params = {}, limit = 10 }: { params?: DiscoverMovieParams, limit?: number; } = {}) {
        TmdbClient.info('Fetching Discover Movie');

        return TmdbClient.paginatedResponse<TmdbDiscover, Movie>(this, '_movie', limit, { params });
    };

    /**
     * Fetches a paginated list of TV shows based on various criteria.
     * @param {number} page - The page number to fetch.
     * @returns {Promise<PaginatedResponse<TvShow>>} A promise that resolves to a paginated response of TV shows.
     */
    protected async _tv({ params = {}, page = 1 }: { params?: DiscoverTvShowParams, page?: number; } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching Discover TV Show page ${page} with params ${JSON.stringify(params)}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/tv`, {
            params: {
                page: page,
                ...params,
            },
        });

        return data;
    }
    /**
     * Fetches a list of Tv Shows based on the provided parameters.
     * @param params The parameters to use for the request.
     * @param limit The maximum number of Tv Shows to return. Defaults to 10.
     * @returns A Promise that resolves to an array of `Tv` objects.
     */
    public async tv({ params = {}, limit = 10 }: { params?: DiscoverTvShowParams, limit?: number; }) {
        TmdbClient.info('Fetching Discover TV Show');

        return TmdbClient.paginatedResponse<TmdbDiscover, TvShow>(this, '_tv', limit, { params });
    };
};

export default TmdbDiscover;