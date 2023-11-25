import moment from "moment";

import TmdbClient from "./TmdbClient";

import type { PaginatedResponse } from "./types/helpers";
import type { TvChange, TvChanges } from "./types/tv/changes";
import type { TvImages } from "./types/tv/images";
import type { TvLatest } from "./types/tv/latest";
import type { TvShow } from "./types/tv/tv";
import type { TvShowTranslations } from "./types/tv/translations";
import type { TvVideos } from "./types/tv/videos";
import type { Video } from "./types/shared/video";
import type { TvDetails, TvWithAppends } from "./types/tv/details";

interface TmdbTvShowInterface {
    id: number;
    language?: string;
}

/**
 * Represents TV Series from The Movie Database (TMDb).
 */
class TmdbTvShow extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbTvShowInterface} [options] - The options to initialize the TmdbTvShow instance with.
     * @param {number} [options.id] - The ID of the tv Show.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, language = i18next.language }: TmdbTvShowInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;

        this.url = `tv/${this.id}`;
    }

    /**
     * Fetches all details of a tv Show from TMDb API, including alternative titles, release dates, credits, keywords, recommendations, similar Tv Shows, translations, external IDs, videos, images, and watch providers.
     * @returns A promise that resolves to an object containing all details of the tv Show.
     */
    async allDetails(): Promise<TvWithAppends<"aggregate_credits" | "alternative_titles" | "content_ratings" | "credits" | "external_ids" | "images" | "keywords" | "recommendations" | "similar" | "translations" | "videos" | "watch/providers">> {

        const tvAppend = [
            'aggregate_credits',
            'alternative_titles',
            'content_ratings',
            'credits',
            'external_ids',
            'images',
            'keywords',
            'recommendations',
            'similar',
            'translations',
            'videos',
            'watch/providers',
        ] as const;

        TmdbClient.info(`Fetching TV Show ${this.id} Details including ${tvAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: tvAppend.join(','),
                include_image_language: `en,null,${this.language}`,
                include_video_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<TvWithAppends<typeof tvAppend[number]>>(this.url, params);

        return data;
    }

    /**
     * Fetches tv changes from the Tv Database API for the specified number of days back.
     * @param {number} daysBack - The number of days to fetch changes for. Defaults to 1.
     * @returns {Promise<TvChange[]>} - A promise that resolves to an array of tv changes.
     */
    async changes({ daysBack = 1 }: { daysBack: number; }): Promise<TvChange[]> {
        TmdbClient.info(`Fetching TV Show ${this.id} Changes`);

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

        const { data } = await this.get<TvChanges>(`${this.url}/changes`, params);

        return data.changes;
    };

    /**
     * Fetches details of a tv Show with the given id.
     * @returns {Promise<TvDetails>} A promise that resolves to the details of the tv Show.
     */
    async details(): Promise<TvDetails> {

        TmdbClient.info(`Fetching TV Show ${this.id} details,`);

        const { data } = await this.get<TvDetails>(this.url);

        return data;
    }

    /**
     * Fetches the images for the tv Show.
     * @returns A Promise that resolves to a `TvImages` object.
     */
    async images(): Promise<TvImages> {
        TmdbClient.info(`Fetching TV Show ${this.id} Images,`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<TvImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches a paginated list of recommended TV shows.
     * @param page The page number to fetch.
     * @returns A promise that resolves to a paginated response of TV shows.
     */
    protected async _recommendations({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching TV Show ${this.id} Recommendations page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/recommendations`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches tv recommendations for the current tv Show.
     * @param limit - The maximum number of recommendations to fetch. Defaults to 10.
     * @returns A Promise that resolves to an array of Tv objects representing the recommendations.
     */
    async recommendations({ limit = 10, language = i18next.language }: { limit: number, language: string; }): Promise<TvShow[]> {
        TmdbClient.info(`Fetching TV Show ${this.id} Recommendations,`);

        const instance = new TmdbTvShow({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbTvShow, TvShow>(instance, '_recommendations', limit);
    };

    /**
     * Fetches a paginated list of TV shows that are similar to the current TV show.
     * @param {number} page - The page number of the results to fetch.
     * @returns {Promise<PaginatedResponse<TvShow>>} A Promise that resolves to a paginated response of TV shows.
     */
    protected async _similar({ page = 1 }: { page?: number; } = {}): Promise<PaginatedResponse<TvShow>> {
        TmdbClient.info(`Fetching TV Show ${this.id} Similar page ${page}`);

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/similar`, {
            params: {
                page: page,
            },
        });

        return data;
    }
    /**
     * Fetches similar Tv Shows for the current tv Show.
     * @param limit - The maximum number of similar Tv Shows to fetch.
     * @returns An array of Tv objects representing the similar Tv Shows.
     */
    async similar({ limit = 10, language = i18next.language }: { limit: number, language: string; }): Promise<TvShow[]> {
        TmdbClient.info(`Fetching TV Show ${this.id} Similar`);

        const instance = new TmdbTvShow({ id: 0, language: language = i18next.language });
        return TmdbClient.paginatedResponse<TmdbTvShow, TvShow>(instance, '_similar', limit);
    };

    /**
     * Fetches the videos for the tv Show from the TvDB API.
     * @returns A promise that resolves to an array of Video objects.
     */
    async videos(): Promise<Video[]> {
        TmdbClient.info(`Fetching TV Show ${this.id} Videos`);

        const params = {
            params: {
                language: 'null',
            },
        };

        const { data } = await this.get<TvVideos>(`${this.url}/videos`, params);

        return data.results;
    };

    /**
     * Fetches translations for the tv Show with the given ID.
     * @returns A Promise that resolves to an object containing the tv translations.
     */
    async translations(): Promise<TvShowTranslations> {
        TmdbClient.info(`Fetching TV Show ${this.id} Translations`);

        const { data } = await this.get<TvShowTranslations>(`tv/${this.id}/translations`);

        return data;
    };

    /**
     * Fetches the latest tv from the TvDB API.
     * @param language The language to use for the tv Show data. Defaults to the current i18next language.
     * @returns A Promise that resolves to the latest tv data.
     */
    static async latest({ language = i18next.language }: { language?: string; } = {}) {
        const instance = new TmdbTvShow({ id: 0, language: language = i18next.language });
        TmdbClient.info('Fetching TV Show Lastest');

        const { data } = await instance.get<TvLatest>('tv/latest');

        return data;
    };

}

export default TmdbTvShow;