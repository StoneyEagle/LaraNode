

import TmdbClient from "./TmdbClient";
import { NetworkAlternatetiveNames } from "./types/networks/network_alternatetive_names";
import { NetworkDetails, NetworkWithAppends } from "./types/networks/network_details";
import { NetworkImages } from "./types/networks/network_images";

interface TmdbNetworkInterface {
    id?: number;
    language?: string;
}

/**
 * Represents a Networs from The Movie Database (TMDb).
 */
class TmdbNetwork extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbNetworkInterface} [options] - The options to initialize the TmdbNetwork instance with.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, language = i18next.language }: TmdbNetworkInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.url = `network/${id}`;
    }
    
    async allDetails() {

        const networkAppend = [
            'alternative_names',
            'images',
        ] as const;

        TmdbClient.info(`Fetching Network ${this.id} Details including ${networkAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: networkAppend.join(','),
                include_image_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<NetworkWithAppends<typeof networkAppend[number]>>(this.url, params);

        return data;
    }

    async details(): Promise<NetworkDetails> {

        TmdbClient.info(`Fetching Network ${this.id} Details`);

        const { data } = await this.get<NetworkDetails>(this.url);

        return data;
    }

    async alternativeNames(): Promise<NetworkAlternatetiveNames> {
        TmdbClient.info(`Fetching Network ${this.id} Alternative Names`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<NetworkAlternatetiveNames>(`${this.url}/alternative_names`, params);

        return data;
    };

    async images(): Promise<NetworkImages> {
        TmdbClient.info(`Fetching Network ${this.id} Images`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<NetworkImages>(`${this.url}/images`, params);

        return data;
    };
};

export default TmdbNetwork;