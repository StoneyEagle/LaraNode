
import TmdbClient from "./TmdbClient";
import type { MovieGenre } from "./types/genres/movie_genre";
import type { TvGenre } from "./types/genres/tv_genres";
import { Genre } from "./types/shared/genre";

interface TmdbGenresInterface {
    language?: string;
}

/**
 * Represents Genres from The Movie Database (TMDb).
 */
class TmdbGenres extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbGenresInterface} [options] - The options to initialize the TmdbGenres instance with.
     * @param {string} [options.language] - The language to request for the Genres data.
     */
    constructor({ language = i18next.language }: TmdbGenresInterface = { language: i18next.language }) {
        super({ language });

        this.url = 'genre';
    }

    /**
     * Retrieves the list of genres from TMDb API.
     * 
     * @param language The language code for the genres. Defaults to the current language.
     * @returns A promise that resolves to an array of Genre objects.
     */
    static async genres({ language = i18next.language }: { language?: string; } = {}): Promise<Array<Genre>> {
        const instance = new TmdbGenres({ language: i18next.language });

        const data: Array<Genre> = [];

        await Promise.all([
            instance.movieGenres().then(movie => data.push(...movie)),
            instance.tvGenres().then(tv => data.push(...tv)),
        ]);

        try {
            return unique(data, 'id');
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Fetches the list of movie genres from TMDb API.
     * @param language The language to use for the genre names. Defaults to the current i18next language.
     * @returns A promise that resolves to an array of MovieGenre objects.
     */
    async movieGenres(): Promise<Array<Genre>> {

        const { data } = await this.get<MovieGenre>(`${this.url}/movie/list`);

        return data.genres;
    };
    
    /**
     * Fetches the list of tv genres from TMDb API.
     * @param language The language to use for the genre names. Defaults to the current i18next language.
     * @returns A promise that resolves to an array of TvGenre objects.
     */
    async tvGenres(): Promise<Array<Genre>> {

        const { data } = await this.get<TvGenre>(`${this.url}/tv/list`);

        return data.genres;
    };

};

export default TmdbGenres;