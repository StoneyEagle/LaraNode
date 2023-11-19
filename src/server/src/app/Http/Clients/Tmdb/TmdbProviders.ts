

import TmdbClient from "./TmdbClient";
import type { WatchProvider, WatchProviders } from "./types/shared/watch_provider";
import type { Region, Regions } from "./types/watch_providers/regions";

interface TmdbProvidersInterface {
    language?: string;
}

/**
 * Represents Watch Providers from The Movie Database (TMDb).
 */
class TmdbProviders extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbProvidersInterface} [options] - The options to initialize the TmdbProviders instance with.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ language = i18next.language }: TmdbProvidersInterface = { language: i18next.language }) {
        super({ language });

        this.url = 'watch/providers';
    }

    /**
     * Retrieves an array of watch providers for both movies and TV shows.
     * @returns A promise that resolves to an array of WatchProvider objects.
     */
    public async providers(): Promise<Array<WatchProvider>> {
        const data: Array<WatchProvider> = [];

        await Promise.all([
            this.watchProviderMovie().then((providers) => {
                for (const provider of providers) {
                    data.push(provider);
                }
            }),
            this.watchProviderTv().then((providers) => {
                for (const provider of providers) {
                    data.push(provider);
                }
            }),
        ]);

        return data;
    }

    /**
     * Retrieves a list of watch providers for movies from the TMDB API.
     * @returns A Promise that resolves to an array of WatchProvider objects.
     */
    public async watchProviderMovie(): Promise<WatchProvider[]> {
        const { data } = await this.get<WatchProviders>(`${this.url}/movie`);

        return data.results;
    };

    /**
     * Fetches a list of watch provider regions from the TMDB API.
     * @returns A Promise that resolves to an array of Region objects.
     */
    public async watchProviderRegions(): Promise<Region[]> {
        const { data } = await this.get<Regions>(`${this.url}/regions`);

        return data.results;
    };

    /**
     * Retrieves a list of watch providers for TV shows from the TMDB API.
     * @returns A Promise that resolves to an array of WatchProvider objects.
     */
    public async watchProviderTv(): Promise<WatchProvider[]> {
        const { data } = await this.get<WatchProviders>(`${this.url}/tv`);

        return data.results;
    };
};

export default TmdbProviders;