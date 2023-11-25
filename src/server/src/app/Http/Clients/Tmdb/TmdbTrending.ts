
import TmdbClient from "./TmdbClient";
import type { PaginatedResponse } from "./types/helpers";
import type { TrendingCombined } from "./types/trending/all";
import type { TrendingMovies } from "./types/trending/movies";
import type { TrendingPeople } from "./types/trending/people";
import type { TrendingTvShows } from "./types/trending/tvshows";

interface TmdbTrendingInterface {
    language?: string;
}

/**
 * Represents Trending from The Movie Database (TMDb).
 */
class TmdbTrending extends TmdbClient {

    constructor({ language = i18next.language }: TmdbTrendingInterface = { language: i18next.language }) {
        super({ language });

        this.url = 'trending';
    }

    /**
     * Fetches the trending all for a given time window and page number.
     * @param window The time window for which to fetch the trending all. Can be 'day' or 'week'.
     * @param page The page number of the results to fetch.
     * @returns A Promise that resolves to a PaginatedResponse of All objects.
     */
    protected async _all({ window = 'day', page = 1 }: { window?: 'day' | 'week', page?: number; } = {}): Promise<PaginatedResponse<TrendingCombined>> {
        TmdbClient.info(`Fetching Trending All page ${page}`);

        const { data } = await this.get<PaginatedResponse<TrendingCombined>>(`${this.url}/all/${window}`, {
            params: {
                page: page,
                window: window,
            },
        });

        return data;
    }
    /**
     * Fetches a list of trending all from TMDb API.
     * @param window The time window for the trending all. Can be 'day' or 'week'. Defaults to 'day'.
     * @param limit The maximum number of all to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of All objects.
     */
    public async all({ window = 'day', limit = 10 }: { window?: 'day' | 'week', limit?: number; } = {}) {
        TmdbClient.info('Fetching Trending All');

        return TmdbClient.paginatedResponse<TmdbTrending, TrendingCombined>(this, '_all', limit, { window });
    };

    /**
     * Fetches the trending movies for a given time window and page number.
     * @param window The time window for which to fetch the trending movies. Can be 'day' or 'week'.
     * @param page The page number of the results to fetch.
     * @returns A Promise that resolves to a PaginatedResponse of Movie objects.
     */
    protected async _movie({ window = 'day', page = 1 }: { window?: 'day' | 'week', page?: number; } = {}): Promise<PaginatedResponse<TrendingMovies>> {
        TmdbClient.info(`Fetching Trending Movies page ${page}`);

        const { data } = await this.get<PaginatedResponse<TrendingMovies>>(`${this.url}/movie/${window}`, {
            params: {
                page: page,
                window: window,
            },
        });

        return data;
    }
    /**
     * Fetches a list of trending movies from TMDb API.
     * @param window The time window for the trending movies. Can be 'day' or 'week'. Defaults to 'day'.
     * @param limit The maximum number of movies to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Movie objects.
     */
    public async movie({ window = 'day', limit = 10 }: { window?: 'day' | 'week', limit?: number; } = {}) {
        TmdbClient.info('Fetching Trending Movies');

        return TmdbClient.paginatedResponse<TmdbTrending, TrendingMovies>(this, '_movie', limit, { window });
    };

    /**
     * Fetches a paginated list of trending People.
     * @param window The time window to retrieve trending People for. Can be either 'day' or 'week'. Defaults to 'day'.
     * @param page The page number to retrieve. Defaults to 1.
     * @returns A promise that resolves to a paginated response of People.
     */
    protected async _people({ window = 'day', page = 1 }: { window?: 'day' | 'week', page?: number; } = {}): Promise<PaginatedResponse<TrendingPeople>> {
        TmdbClient.info(`Fetching Trending People page ${page}`);

        const { data } = await this.get<PaginatedResponse<TrendingPeople>>(`${this.url}/people/${window}`, {
            params: {
                page: page,
                window: window,
            },
        });

        return data;
    }
    /**
     * Fetches a list of trending People from TMDb API.
     * @param window The time window for the trending People. Can be 'day' or 'week'. Defaults to 'day'.
     * @param limit The maximum number of People to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Person objects.
     */
    public async people({ window = 'day', limit = 10 }: { window?: 'day' | 'week', limit?: number; } = {}) {
        TmdbClient.info('Fetching Trending People');

        return TmdbClient.paginatedResponse<TmdbTrending, TrendingPeople>(this, '_people', limit, { window });
    };

    /**
     * Fetches a paginated list of trending TV shows.
     * @param window The time window to retrieve trending TV shows for. Can be either 'day' or 'week'. Defaults to 'day'.
     * @param page The page number to retrieve. Defaults to 1.
     * @returns A promise that resolves to a paginated response of TV shows.
     */
    protected async _tv({ window = 'day', page = 1 }: { window?: 'day' | 'week', page?: number; } = {}): Promise<PaginatedResponse<TrendingTvShows>> {
        TmdbClient.info(`Fetching Trending TV Shows page ${page}`);

        const { data } = await this.get<PaginatedResponse<TrendingTvShows>>(`${this.url}/tv/${window}`, {
            params: {
                page: page,
                window: window,
            },
        });

        return data;
    }
    /**
     * Fetches a list of trending Tv Shows from TMDb API.
     * @param window The time window for the trending Tv Shows. Can be 'day' or 'week'. Defaults to 'day'.
     * @param limit The maximum number of Tv Shows to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of TvShow objects.
     */
    public async tv({ window = 'day', limit = 10 }: { window?: 'day' | 'week', limit?: number; } = {}) {
        TmdbClient.info('Fetching Trending TV Shows');

        return TmdbClient.paginatedResponse<TmdbTrending, TrendingTvShows>(this, '_tv', limit, { window });
    };

};

export default TmdbTrending;