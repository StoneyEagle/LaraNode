import moment from "moment";


import TmdbClient from "./TmdbClient";

import type { MovieDetails, MovieWithAppends } from "./types/movie/movie-details";
import type { PaginatedResponse } from "./types/helpers";
import type { MovieChange, MovieChanges } from "./types/movie/changes";
import type { MovieImages } from "./types/movie/images";
import type { MovieLatest } from "./types/movie/latest";
import type { Movie } from "./types/movie/movie";
import type { MovieTranslations } from "./types/movie/translations";
import type { MovieVideos } from "./types/movie/videos";
import type { Video } from "./types/shared/video";

interface TmdbMoviesInterface {
    id: number;
    language?: string;
}

/**
 * Represents Movies from The Movie Database (TMDb).
 */
class TmdbMovies extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbMoviesInterface} [options] - The options to initialize the TmdbMovies instance with.
     * @param {number} [options.id=0] - The ID of the movie.
     * @param {string} [options.language=i18next.language] - The language to use for the movie data.
     */
    constructor({ id, language = i18next.language }: TmdbMoviesInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;

        this.url = `movie/${this.id}`;
    }

    /**
     * Fetches all details of a movie from TMDb API, including alternative titles, release dates, credits, keywords, recommendations, similar movies, translations, external IDs, videos, images, and watch providers.
     * @returns A promise that resolves to an object containing all details of the movie.
     */
    async allDetails(): Promise<MovieWithAppends<"alternative_titles" | "release_dates" | "credits" | "keywords" | "recommendations" | "similar" | "translations" | "external_ids" | "videos" | "images" | "watch/providers">> {

        const movieAppend = [
            'alternative_titles',
            'release_dates',
            'credits',
            'keywords',
            'recommendations',
            'similar',
            'translations',
            'external_ids',
            'videos',
            'images',
            'watch/providers',
        ] as const;

        TmdbClient.info(`Fetching Movie ${this.id} Details including ${movieAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: movieAppend.join(','),
                include_image_language: `en,null,${this.language}`,
                include_video_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<MovieWithAppends<typeof movieAppend[number]>>(this.url, params);

        return data;
    }

    /**
     * Fetches movie changes from the Movie Database API for the specified number of days back.
     * @param {number} daysBack - The number of days to fetch changes for. Defaults to 1.
     * @returns {Promise<MovieChange[]>} - A promise that resolves to an array of movie changes.
     */
    async changes(daysBack: number = 1): Promise<MovieChange[]> {
        TmdbClient.info(`Fetching Movie ${this.id} Changes`);

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

        const { data } = await this.get<MovieChanges>(`${this.url}/changes`, params);

        return data.changes;
    };

    /**
     * Fetches details of a movie with the given id.
     * @returns {Promise<MovieDetails>} A promise that resolves to the details of the movie.
     */
    async details(): Promise<MovieDetails> {

        TmdbClient.info(`Fetching Movie ${this.id} Details`);

        const { data } = await this.get<MovieDetails>(this.url);

        return data;
    }

    /**
     * Fetches the images for the movie.
     * @returns A Promise that resolves to a `MovieImages` object.
     */
    async images(): Promise<MovieImages> {
        TmdbClient.info(`Fetching Movie ${this.id} Images`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<MovieImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches a paginated list of recommended movies for the given movie.
     * @param {number} page - The page number to fetch.
     * @param {string} language - The language to use for the response.
     * @returns {Promise<PaginatedResponse<Movie>>} - A promise that resolves to a paginated response of recommended movies.
     */
    protected async _recommendations({ page = 1, language = i18next.language }: { page: number, language: string; }): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Movie ${this.id} Recommendations page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/recommendations`, {
            params: {
                page: page,
                language: language,
            },
        });

        return data;
    }
    /**
     * Fetches movie recommendations for the current movie.
     * @param limit - The maximum number of recommendations to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Movie objects representing the recommendations.
     */
    async recommendations({ limit = 10, language = i18next.language }: { limit: number, language: string; }): Promise<Movie[]> {
        TmdbClient.info(`Fetching Movie ${this.id} Recommendations`);

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, '_recommendations', limit);
    };

    /**
     * Fetches a paginated list of movies similar to this one.
     * @param page The page number to fetch.
     * @param language The language to use for the response.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async _similar({ page = 1, language = i18next.language }): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching movie Similar page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/similar`, {
            params: {
                page: page,
                language: language,
            },
        });

        return data;
    }
    /**
     * Fetches similar movies for the current movie.
     * @param limit - The maximum number of similar movies to fetch.
     * @returns An array of Movie objects representing the similar movies.
     */
    async similar(limit = 10, language = i18next.language): Promise<Movie[]> {
        TmdbClient.info(`Fething Movie ${this.id} Similar`);

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, '_similar', limit);
    };

    /**
     * Fetches the videos for the movie from the MovieDB API.
     * @returns A promise that resolves to an array of Video objects.
     */
    async videos(): Promise<Video[]> {
        TmdbClient.info(`Fetching Movie ${this.id} Videos`);

        const params = {
            params: {
                language: 'null',
            },
        };

        const { data } = await this.get<MovieVideos>(`${this.url}/videos`, params);

        return data.results;
    };

    /**
     * Fetches translations for the movie with the given ID.
     * @returns A Promise that resolves to an object containing the movie translations.
     */
    async translations(): Promise<MovieTranslations> {
        TmdbClient.info(`Fetching Movie ${this.id} Translations`);

        const { data } = await this.get<MovieTranslations>(`movie/${this.id}/translations`);

        return data;
    };


    /**
     * Fetches the latest movie from the MovieDB API.
     * @param language The language to use for the movie data. Defaults to the current i18next language.
     * @returns A Promise that resolves to the latest movie data.
     */
    static async latest({ language = i18next.language }: { language?: string; } = {}) {
        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        TmdbClient.info('Fetching Movie Lastest');

        const { data } = await instance.get<MovieLatest>('movie/latest');

        return data;
    };

    /**
     * Fetches a paginated list of movies that are currently playing in theaters.
     * @param page - The page number of the results to fetch.
     * @returns A promise that resolves to a paginated response of movies.
     */
    protected async nowPlaying({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Movie ${this.id} Now Playing page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>('movie/now_playing', {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of currently playing movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @param language - The language in which to fetch the movies. Defaults to the current language set in i18next.
     * @returns A promise that resolves to an array of Movie objects.
     */
    static async nowPlaying({ limit = 10, language = i18next.language }: { limit?: number, language?: string; } = {}) {
        TmdbClient.info('Fetching Movie Now Playing');

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, 'nowPlaying', limit);

    };

    /**
     * Fetches a paginated list of popular movies from TMDB.
     * @param {Object} options - The options for the request.
     * @param {number} options.page - The page number to fetch.
     * @returns {Promise<PaginatedResponse<Movie>>} - A promise that resolves to a paginated response of movies.
     */
    protected async popular({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Movie ${this.id} Popular page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>('movie/popular', {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches popular movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @param language - The language of the movies to fetch. Defaults to the current i18next language.
     * @returns An array of popular movies.
     */
    static popular({ limit = 10, language = i18next.language }: { limit?: number, language?: string; } = {}) {
        TmdbClient.info('fetching Movie Popular');

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, 'popular', limit);
    };

    /**
     * Fetches a paginated list of top rated movies from the TMDB API.
     * @param {number} page - The page number to fetch.
     * @returns {Promise<PaginatedResponse<Movie>>} A promise that resolves to a paginated response of movies.
     */
    protected async topRated({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Movie ${this.id} Popular page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>('movie/top_rated', {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches the top rated movies from TMDb API.
     * @param limit - The maximum number of movies to fetch. Defaults to 10.
     * @param language - The language of the movies to fetch. Defaults to the current language set in i18next.
     * @returns An array of Movie objects representing the top rated movies.
     */
    static async topRated({ limit = 10, language = i18next.language }: { limit?: number, language?: string; } = {}) {
        TmdbClient.info('Fetching Movie Top Rated');

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, 'topRated', limit);

    };

    /**
     * Fetches a paginated list of upcoming movies from the TMDB API.
     * @param page The page number to fetch. Defaults to 1.
     * @returns A Promise that resolves to a PaginatedResponse of Movie objects.
     */
    protected async upcoming({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<Movie>> {
        TmdbClient.info(`Fetching Movie ${this.id} Upcoming page ${page}`);

        const { data } = await this.get<PaginatedResponse<Movie>>('movie/upcoming', {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches a list of upcoming movies from the TMDb API.
     * @param limit The maximum number of movies to fetch (default: 10).
     * @param language The language to use for the movie data (default: the current i18next language).
     * @returns A Promise that resolves to an array of Movie objects.
     */
    static async upcoming({ limit = 10, language = i18next.language }: { limit?: number, language?: string; } = {}) {
        TmdbClient.info('Fetching Movie Upcoming');

        const instance = new TmdbMovies({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbMovies, Movie>(instance, 'upcoming', limit);
    };
}

export default TmdbMovies;