import moment from "moment";


import TmdbClient from "./TmdbClient";

import type { EpisodeDetails, EpisodeWithAppends } from "./types/episode/episode-details";
import type { EpisodeImages } from "./types/episode/images";
import type { EpisodeTranslations } from "./types/episode/translations";
import type { EpisodeChange, EpisodeChanges } from "./types/episode/changes";

interface TmdbEpisodesInterface {
    id: number;
    season: number;
    episode: number;
    language?: string;
}

/**
 * Represents Episodes from The Movie Database (TMDb).
 */
class TmdbEpisodes extends TmdbClient {

    season: number;
    episode: number;

    episodeAppend = [
        'credits',
        'external_ids',
        'images',
        'translations',
        'crew',
        'guest_stars',
        'changes'
    ] as const;

    /**
     * @constructor
     * @param {TmdbEpisodesInterface} [options] - The options to initialize the TmdbEpisodes instance with.
     * @param {number} [options.id] - The ID of the tv Show.
     * @param {number} [options.episode] - The episode number of the tv Show.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, season, episode, language = i18next.language }: TmdbEpisodesInterface = { id: 0, season: 0, episode: 0, language: i18next.language }) {
        super({ language });

        this.id = id;
        this.season = season;
        this.episode = episode;

        this.url = `tv/${this.id}/season/${this.season}/episode/${this.episode}`;
    }

    /**
     * Fetches all details for a specific episode.
     * @returns A promise that resolves to an object containing all details for the episode.
     */
    async allDetails() {

        TmdbClient.info(`Fetching Episode with TV id: ${this.id} and Season number ${this.season} and Episode number ${this.episode} including ${this.episodeAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: this.episodeAppend.join(','),
                include_image_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<EpisodeWithAppends<typeof this.episodeAppend[number]>>(this.url, params);

        return data;
    }

    /**
     * Fetches the changes for the episode within the specified number of days.
     * @param {number} daysBack - The number of days to look back for changes. Maximum value is 14.
     * @returns {Promise<EpisodeChange[]>} - A promise that resolves to an array of EpisodeChange objects.
     */
    async changes({ daysBack = 1 }: { daysBack: number; }): Promise<EpisodeChange[]> {
        TmdbClient.info(`Fetching Episode Changes with TV id: ${this.id} and Season number ${this.season} and Episode number ${this.episode}`);

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

        const { data } = await this.get<EpisodeChanges>(`${this.url}/changes`, params);

        return data.changes;
    };

    /**
     * Fetches the details of a episode.
     * @returns A Promise that resolves to a `EpisodeDetails` object.
     */
    async details(): Promise<EpisodeDetails> {

        TmdbClient.info(`Fetching Episode with TV id: ${this.id} and Season number ${this.season} and Episode number ${this.episode}`);

        const { data } = await this.get<EpisodeDetails>(this.url);

        return data;
    }

    /**
     * Fetches the images for the episode.
     * @returns A Promise that resolves to a `EpisodeImages` object.
     */
    async images(): Promise<EpisodeImages> {
        TmdbClient.info(`Fetching Episode Images with TV id: ${this.id} and Season number ${this.season} and Episode number ${this.episode}`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<EpisodeImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches the translations for the episode.
     * @returns A promise that resolves to a `EpisodeTranslations` object.
     */
    async translations(): Promise<EpisodeTranslations> {
        TmdbClient.info(`Fetching Episode Translations with TV id: ${this.id} and Season number ${this.season} and Episode number ${this.episode}`);

        const { data } = await this.get<EpisodeTranslations>(`tv/${this.id}/translations`);

        return data;
    };

    /**
     * Fetches combined episodes for a season.
     * @param episodes An array of episode numbers to fetch.
     * @returns An array of EpisodeWithAppends objects.
     */
    static async episodes({ id, season, episodes, language = i18next.language }: { id: number, season: number, episodes: number[], language?: string; }): Promise<EpisodeWithAppends<typeof TmdbEpisodes.prototype.episodeAppend[number]>[]> {
        TmdbClient.info(`Fetching Combined Episodes for TV Show ${id} and Season ${season}`);

        const arr: EpisodeWithAppends<typeof TmdbEpisodes.prototype.episodeAppend[number]>[] = [];

        return new Promise(async (resolve, reject) => {

            for (const episode of episodes) {
                const instance = new TmdbEpisodes({
                    id: id,
                    season: season,
                    episode: episode,
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
                        if (arr.length === episodes.length) {
                            resolve(arr);
                        }
                    });
            }
        });
    };
}

export default TmdbEpisodes;