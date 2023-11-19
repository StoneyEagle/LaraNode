

import TmdbClient from "./TmdbClient";
import type { PersonDetails, PersonWithAppends } from "./types/people/details";
import type { PersonImages } from "./types/people/images";
import type { PersonTranslations } from "./types/people/translations";
import moment from "moment";
import type { PeopleChange, PeopleChanges } from "./types/people/changes";

interface TmdbPeopleInterface {
    id: number;
    language?: string;
}

/**
 * Represents People from The Movie Database (TMDb).
 */
class TmdbPeople extends TmdbClient {

    personAppend = [
        'details',
        'combined_credits',
        'movie_credits',
        'credits',
        'tv_credits',
        'external_ids',
        'images',
        'translations'
    ] as const;

    /**
     * Represents People in The Movie Database (TMDb).
     * @constructor
     * @param {TmdbPeopleInterface} [options] - The options to initialize the TmdbPeople instance with.
     * @param {number} [options.id] - The ID of the person.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, language = i18next.language }: TmdbPeopleInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;

        this.url = `person/${this.id}`;
    }

    /**
     * Fetches all details for a specific person.
     * @returns A promise that resolves to an object containing all details for the person.
     */
    async allDetails() {

        TmdbClient.info(`Fetching Person ${this.id} including ${this.personAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: this.personAppend.join(','),
            }
        };

        const { data } = await this.get<PersonWithAppends<typeof this.personAppend[number]>>(this.url, params);

        return data;
    }

    /**
     * Fetches the changes for the person within the specified number of days.
     * @param {number} daysBack - The number of days to look back for changes. Maximum value is 14.
     * @returns {Promise<PersonChange[]>} - A promise that resolves to an array of PersonChange objects.
     */
    async changes({ daysBack = 1 }: { daysBack: number; }): Promise<PeopleChange[]> {
        TmdbClient.info(`Fetching Person Changes with id: ${this.id},`);

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

        const { data } = await this.get<PeopleChanges>(`${this.url}/changes`, params);

        return data.changes;
    };

    /**
     * Fetches the details of a person.
     * @returns A Promise that resolves to a `PersonDetails` object.
     */
    async details(): Promise<PersonDetails> {

        TmdbClient.info(`Fetching Person with id: ${this.id},`);

        const { data } = await this.get<PersonDetails>(this.url);

        return data;
    }

    /**
     * Fetches the images for the person.
     * @returns A Promise that resolves to a `PersonImages` object.
     */
    async images(): Promise<PersonImages> {
        TmdbClient.info(`Fetching Person Images with id: ${this.id},`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<PersonImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches the translations for the person.
     * @returns A promise that resolves to a `PersonTranslations` object.
     */
    async translations(): Promise<PersonTranslations> {
        TmdbClient.info(`Fetching Person Translations with TV id: ${this.id}`);

        const { data } = await this.get<PersonTranslations>(`tv/${this.id}/translations`);

        return data;
    };

    /**
     * Fetches combined people for a season.
     * @param people An array of person numbers to fetch.
     * @returns An array of PersonWithAppends objects.
     */
    static async people({ people, language = i18next.language }: { people: number[], language?: string; }): Promise<PersonWithAppends<typeof TmdbPeople.prototype.personAppend[number]>[]> {
        TmdbClient.info(`Fetching Combined People`);

        return new Promise((resolve, reject) => {
            const arr: PersonWithAppends<typeof TmdbPeople.prototype.personAppend[number]>[] = [];
            let jobs = people.length;

            for (const person of people) {
                const instance = new TmdbPeople({
                    id: person,
                    language: language,
                });

                instance.allDetails()
                    .then((res) => {
                        arr.push(res);
                        jobs -= 1;
                    }).catch((err) => {
                        reject(err);
                    }).finally(() => {
                        if (jobs === 0) {
                            resolve(arr);
                        }
                    });
            }
        });
    };
}

export default TmdbPeople;
