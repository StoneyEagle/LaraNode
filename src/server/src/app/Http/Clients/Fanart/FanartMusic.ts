import FanartClient from "./FanartClient";

import type { AlbumImage } from "./types/music/album";
import type { ArtistImage } from "./types/music/artist";
import type { ArtistLatest } from "./types/music/latest";

/**
 * Represents Music in the Fanart API.
 */
class FanartMusic extends FanartClient {

    constructor() {
        super();

        this.url = `music`;
    }

    public async artist(id: string) {
        FanartClient.info(`Fetching Music Artist ${id} Images`);

        const { data } = await this.get<ArtistImage>(`${this.url}/${id}`);

        return data;
    };

    public async album(id: string) {
        FanartClient.info(`Fetching Music Album ${id} Images`);

        const { data } = await this.get<AlbumImage>(`${this.url}/albums/${id}`);

        return data;
    };

    public async label(id: string) {
        FanartClient.info(`Fetching Music Label ${id} Images`);

        const { data } = await this.get<ArtistImage>(`${this.url}/labels/${id}`);

        return data;
    };

    public async latest(date = Date.now()) {
        FanartClient.info('Fetching Latest Music');

        const { data } = await this.get<ArtistLatest>(`${this.url}/latest`, {
            params: { date },
        });

        return data;
    };

};

export default FanartMusic;