import moment from "moment";


import TmdbClient from "./TmdbClient";

import type { SeasonDetails, SeasonWithAppends } from "./types/season/season-details";
import type { SeasonChange, SeasonChanges } from "./types/season/changes";
import type { SeasonImages } from "./types/season/images";
import type { SeasonTranslations } from "./types/season/translations";

interface TmdbSeasonsInterface {
    id: number;
    season: number;
    language?: string;
}

/**
 * Represents Seasons from The Movie Database (TMDb).
 */
class TmdbSeasons extends TmdbClient {

    season: number;

    seasonAppend = [
        'aggregate_credits',
        'credits',
        'external_ids',
        'images',
        'translations'
    ] as const;

    /**
     * @constructor
     * @param {TmdbSeasonsInterface} [options] - The options to initialize the TmdbSeasons instance with.
     * @param {number} [options.id] - The ID of the tv Show.
     * @param {number} [options.season] - The season number of the tv Show.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, season, language = i18next.language }: TmdbSeasonsInterface = { id: 0, season: 0, language: i18next.language }) {
        super({ language });

        this.id = id;
        this.season = season;

        this.url = `tv/${this.id}/season/${this.season}`;
    }

    /**
     * Fetches all details for a specific season.
     * @returns A promise that resolves to an object containing all details for the season.
     */
    async allDetails(): Promise<SeasonWithAppends<typeof this.seasonAppend[number]>> {

        TmdbClient.info(`Fetching Season with TV id: ${this.id} and Season number ${this.season} including ${this.seasonAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: this.seasonAppend.join(','),
                include_image_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<SeasonWithAppends<typeof this.seasonAppend[number]>>(this.url, params);

        return data;
    }

    /**
     * Fetches the changes for the season within the specified number of days.
     * @param {number} daysBack - The number of days to look back for changes. Maximum value is 14.
     * @returns {Promise<SeasonChange[]>} - A promise that resolves to an array of SeasonChange objects.
     */
    async changes({ daysBack = 1 }: { daysBack: number; }): Promise<SeasonChange[]> {
        TmdbClient.info(`Fetching Season Changes with TV id: ${this.id} and Season number ${this.season}`);

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

        const { data } = await this.get<SeasonChanges>(`${this.url}/changes`, params);

        return data.changes;
    };

    /**
     * Fetches the details of a season.
     * @returns A Promise that resolves to a `SeasonDetails` object.
     */
    async details(): Promise<SeasonDetails> {
        TmdbClient.info(`Fetching TV Show ${this.id} details with id: ${this.id},`);

        const { data } = await this.get<SeasonDetails>(this.url);

        return data;
    }

    /**
     * Fetches the images for the season.
     * @returns A Promise that resolves to a `SeasonImages` object.
     */
    async images(): Promise<SeasonImages> {
        TmdbClient.info(`Fetching Season Images with TV id: ${this.id} and Season number ${this.season}`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<SeasonImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches the translations for the season.
     * @returns A promise that resolves to a `SeasonTranslations` object.
     */
    async translations(): Promise<SeasonTranslations> {
        TmdbClient.info(`Fetching TV Show ${this.id} Translations with id: ${this.id},`);

        const { data } = await this.get<SeasonTranslations>(`tv/${this.id}/translations`);

        return data;
    };

    /**
     * Fetches combined seasons for TV Show.
     * @param seasons - An optional array of season numbers to fetch.
     * @returns A promise that resolves to an array of seasons with appends.
     */
    static async seasons({ id, seasons = [], language = i18next.language }: { id: number, seasons: number[], language?: string; }): Promise<SeasonWithAppends<typeof TmdbSeasons.prototype.seasonAppend[number]>[]> {
        TmdbClient.info(`Fetching Combined Seasons for TV Show ${id}`);

        const arr: SeasonWithAppends<typeof TmdbSeasons.prototype.seasonAppend[number]>[] = [];

        return new Promise(async (resolve, reject) => {

            for (const season of seasons) {
                const instance = new TmdbSeasons({
                    id: id,
                    season: season,
                    language: language,
                });

                instance.allDetails()
                    .then((res) => {
                        arr.push(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
                    .finally(() => {
                        if (arr.length === seasons.length) {
                            resolve(arr);
                        }
                    });
            }
        });

    };
}

export default TmdbSeasons;