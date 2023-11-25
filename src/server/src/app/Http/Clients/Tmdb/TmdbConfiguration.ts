

import TmdbClient from "./TmdbClient";
import type { Configuration } from "./types/config/configuration";
import type { Country } from "./types/config/country";
import type { Job } from "./types/config/job";
import { Language } from "./types/config/language";
import type { TimeZone } from "./types/config/timeZone";
"./types/config/language";

interface TmdbConfigurationInterface {
    language?: string;
}

/**
 * Represents a Configuration from The Movie Database (TMDb).
 */
class TmdbConfiguration extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbConfigurationInterface} [options] - The options to initialize the TmdbConfiguration instance with.
     * @param {string} [options.language] - The language to use for the Configuration data.
     */
    constructor({ language = i18next.language }: TmdbConfigurationInterface = { language: i18next.language }) {
        super({ language });

        this.url = `configuration`;
    }

    public async configuration() {
        const { data } = await this.get<Configuration>('configuration');

        return data;
    };

    public async languages() {
        const { data } = await this.get<Language[]>('configuration/languages');

        return data;
    };

    public async countries() {
        const { data } = await this.get<Country[]>('configuration/countries');

        return data;
    };

    public async jobs() {
        const { data } = await this.get<Job[]>('configuration/jobs');

        return data;
    };

    public async primaryTranslations() {
        const { data } = await this.get<string[]>('configuration/primary_translations');

        return data;
    };

    public async timezones() {
        const { data } = await this.get<TimeZone[]>('configuration/timezones');

        return data;
    };

};

export default TmdbConfiguration;