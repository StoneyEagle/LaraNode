

import MusicbrainzClient from "./MusicbrainzClient";

interface MusicbrainzResourceInterface {
    id: number;
}

/**
 * Represents a Resource from The Movie Database (Musicbrainz).
 */
class MusicbrainzResource extends MusicbrainzClient {
    id: number;

    /**
     * @constructor
     * @param {MusicbrainzResourceInterface} [options] - The options to initialize the MusicbrainzResource instance with.
     * @param {number} [options.id] - The ID of the collection.
     */
    constructor({ id }: MusicbrainzResourceInterface = { id: 0 }) {
        super();

        this.id = id;
        this.url = `resource/${id}`;
    }

};

export default MusicbrainzResource;