

import MusicbrainzClient from "./MusicbrainzClient";
import type { Genre, PaginatedGenreResponse } from "./types/genre";

/**
 * Represents a Genre from The Movie Database (Musicbrainz).
 */
class MusicbrainzGenre extends MusicbrainzClient {

    constructor() {
        super();

        this.url = `genre`;
    }

    public async details(id: string) {
        MusicbrainzClient.info(`Fetching Music Genre with ID ${id}`);

        try {
            const { data } = await this.get<Genre>(`${this.url}/${id}`);

            return data;
        } catch (error) {
            MusicbrainzClient.error(`Error fetching Music Genre with ID ${id}`);

            return null;
        }
    }

    private async _all({ page, limit = 100 }:{ page: number, limit?: number }) {
        MusicbrainzClient.info(`Fetching all Music Genres page ${page} with ${limit} results per page`);

        const { data } = await this.get<PaginatedGenreResponse>(`${this.url}/all`, {
            params: {
                limit: limit,
                offset: (page - 1) * limit,
            },
        });

        return data;
    }

    public async all() {
        MusicbrainzClient.info('Fetching all Music Genres');
    
        try {
            const arr: Genre[] = [];

            const data = await this._all({ page: 1 });
            arr.push(...data.genres);
    
            for (let i = 2; i < Math.floor(data['genre-count'] / data.genres.length); i++) {

                const data2 = await this._all({ 
                    limit: data.genres.length,
                    page: i,
                });
                arr.push(...data2.genres);    
            }
    
            return arr;
    
        } catch (error) {
            MusicbrainzClient.info('Error fetching music genres');
    
            return [];
        }
    };
};

export default MusicbrainzGenre;