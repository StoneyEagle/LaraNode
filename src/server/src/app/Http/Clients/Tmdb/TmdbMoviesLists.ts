
import TmdbClient from "./TmdbClient";

import type { PaginatedResponse } from "./types/helpers";
import type { Movie } from "./types/movie/movie";

interface TmdbMoviesListsInterface {
    language?: string;
}

/**
 * Represents Movies from The Movie Database (TMDb).
 */
class TmdbMoviesLists extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbMoviesListsInterface} [options] - The options to initialize the TmdbMoviesLists instance with.
     * @param {string} [options.language=i18next.language] - The language to use for the movie data.
     */
    constructor({ language = i18next.language }: TmdbMoviesListsInterface = { language: i18next.language }) {
        super({ language });

        this.url = `movie`;
    }

    /**
     * Fetches a paginated list of movies that are currently playing in theaters.
     * @param page - The page number of the results to fetch.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async _nowPlaying({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Now Playing Movies page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/now_playing`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of currently playing movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @returns A promise that resolves to an array of Movie objects.
     */
    public async nowPlaying({ limit = 10 }: { limit?: number; } = {}) {
        TmdbClient.info('Fetching Now Playing Movies');

        return TmdbClient.paginatedResponse<TmdbMoviesLists, Movie>(this, '_nowPlaying', limit);
    };

    /**
     * Fetches a paginated list of popular movies from TMDB.
     * @param {Object} options - The options for the request.
     * @param {number} options.page - The page number to fetch.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async _popular({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Popular Movies page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/popular`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches popular Movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Movie objects.
     */
    public popular({ limit = 10 }: { limit?: number; } = {}) {
        TmdbClient.info('Fetching Popular Movies');

        return TmdbClient.paginatedResponse<TmdbMoviesLists, Movie>(this, 'popular', limit);
    };

    /**
     * Fetches a paginated list of Top Rated Movies from the TMDB API.
     * @param {number} page - The page number to fetch.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async _topRated({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Top Rated Movies page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/top_rated`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches the Top Rated movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Movie objects.
     */
    public async topRated({ limit = 10 }: { limit?: number; } = {}) {
        TmdbClient.info('Fetching Top Rated Movies');

        return TmdbClient.paginatedResponse<TmdbMoviesLists, Movie>(this, '_topRated', limit);
    };

    /**
     * Fetches a paginated list of Upcoming Movies from the TMDB API.
     * @param page The page number to fetch. Defaults to 1.
     * @returns A promise that resolves to a paginated response of Movies.
     */
    protected async _upcoming({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Upcoming Movie page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/upcoming`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of upcoming movies from the TMDb API.
     * @param limit The maximum number of movies to fetch (default: 10).
     * @returns A Promise that resolves to an array of Movie objects.
     */
    public async upcoming({ limit = 10 }: { limit?: number; } = {}) {
        TmdbClient.info('Fetching Upcoming Movie');

        return TmdbClient.paginatedResponse<TmdbMoviesLists, Movie>(this, '_upcoming', limit);
    };
}

export default TmdbMoviesLists;