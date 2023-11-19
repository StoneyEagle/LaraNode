

import TmdbClient from "./TmdbClient";

interface TmdbResourceInterface {
    id: number;
    language?: string;
}

/**
 * Represents a Resource from The Movie Database (TMDb).
 */
class TmdbResource extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbResourceInterface} [options] - The options to initialize the TmdbResource instance with.
     * @param {number} [options.id] - The ID of the collection.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, language = i18next.language }: TmdbResourceInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;
        this.url = `resource/${id}`;
    }

};

export default TmdbResource;