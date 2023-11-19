

import TmdbClient from "./TmdbClient";
import type { Collection } from "./types/collection/collection";
import type { Company } from "./types/company/company";
import type { PaginatedResponse } from "./types/helpers";
import type { Keyword } from "./types/keywords/keyword";
import type { Movie } from "./types/movie/movie";
import type { Person } from "./types/people/person";
import type { TvShow } from "./types/tv/tv";

interface TmdbSearchInterface {
    searchQuery: string
    year?: number | null;
    filterOVAs?: boolean;
    filterMakingOfs?: boolean;
    language?: string;
}

/**
 * Represents a Search from The Movie Database (TMDb).
 */
class TmdbSearch extends TmdbClient {

    private searchQuery: string;
    private year: number | null = null;
    private filterOVAs = true;
    private filterMakingOfs = true;

    /**
     * @constructor
     * @param {TmdbSearchInterface} [options] - The options to initialize the TmdbSearch instance with.
     * @param {string} [options.query] - The query to search for.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ searchQuery, year = null, filterOVAs = true, filterMakingOfs = true, language = i18next.language }: TmdbSearchInterface) {
        super({ language });

        this.searchQuery = this.sanitizeQuery(searchQuery);
        this.year = year;
        this.url = `search`;

        this.filterOVAs = filterOVAs;
        this.filterMakingOfs = filterMakingOfs;
        
        if (!this.searchQuery) {
            TmdbClient.error('No this.query given');
            throw new Error('No this.query given');
        }
    }

    /**
     * Sanitizes a given query string by removing the year if present, replacing "and" with "&",
     * removing any trailing ".(" and replacing any uppercase letter followed by a dot with a space.
     * @param query - The query string to sanitize.
     * @returns The sanitized query string.
     */
    private sanitizeQuery = (query: string): string => {

        if(query.includes(this.year?.toString() ?? '')) {
            query = query.replace(this.year?.toString() ?? '', '');
        }

        return query.replace(/[\s\.]{1,}and[\s\.]{1,}/u, '&')
            .split('.(')[0].replace(/([a-z])\./gu, '$1 ')
            .replace(/([A-Z])\.([A-Z][^A-Z.])/gu, '$1 $2');
    }

    /**
     * Filters the given array of items based on the current filter options.
     * @param result The array of items to filter.
     * @returns The filtered array of items.
     */
    private filter<T>(result: T[]): T[] {
        if (this.filterOVAs) {
            result = this.filterOVA(result);
        }

        if (this.filterMakingOfs) {
            result = this.filterMakingOf(result);
        }

        return result ?? [];
    }

    /**
     * Filters out any movies or TV shows that have "OVA" or "ova" in their title.
     * @param result An array of movies or TV shows to filter.
     * @returns The filtered array of movies or TV shows.
     */
    private filterOVA<T>(result: T[]): T[] {
        if((result as Movie[])[0].title) {
            return (result as Movie[]).filter(d => !d.title.includes('OVA') || !d.title.includes('ova')) as T[];
        } else if((result as TvShow[])[0].name) {
            return (result as TvShow[]).filter(d => !d.name.includes('OVA') || !d.name.includes('ova')) as T[];
        } else {
            return result;
        }
    }

    /**
     * Filters out any movies or TV shows with titles that include "Making of" or "making of".
     * @param result - An array of movies or TV shows to filter.
     * @returns The filtered array of movies or TV shows.
     */
    private filterMakingOf<T>(result: T[]): T[] {
        if((result as Movie[])[0].title) {
            return (result as Movie[]).filter(d => !d.title.includes('Making of') || !d.title.includes('making of')) as T[];
        } else if((result as TvShow[])[0].name) {
            return (result as TvShow[]).filter(d => !d.name.includes('Making of') || !d.name.includes('making of')) as T[];
        } else {
            return result;
        }
    }

    /**
     * Searches for collections in TMDb API based on the provided search query.
     * @returns A Promise that resolves to an array of Collection objects.
     */
    public async collection(): Promise<Collection[]> {
        TmdbClient.info(`Collection Search for: ${this.searchQuery}`);

        const params = {
            params: {
                query: this.searchQuery.replace(/[\s\.]{1,}and[\s\.]{1,}/u, '&').replace(/\s/gu, '%20'),
            },
        };

        const { data } = await this.get<PaginatedResponse<Collection>>(`${this.url}/collection`, params);

        return data.results || [];
    };

    /**
     * Searches for companies on TMDb based on a search query.
     * @returns A Promise that resolves to an array of Company objects.
     */
    public async company(): Promise<Company[]> {
        TmdbClient.info(`Company Search for: ${this.searchQuery}`);
        const params = {
            params: {
                query: this.searchQuery.replace(/\s/gu, '%20'),
            },
        };

        const { data } = await this.get<PaginatedResponse<Company>>(`${this.url}/company`, params);

        return data.results || [];
    };

    /**
     * Searches for keywords related to the current search query.
     * @returns A Promise that resolves to an array of Keyword objects.
     */
    public async keyword(): Promise<Keyword[]> {

        TmdbClient.info(`Keyword Search for: ${this.searchQuery}`);
        const params = {
            params: {
                query: this.searchQuery.replace(/\s/gu, '%20'),
            },
        };

        const { data } = await this.get<PaginatedResponse<Keyword>>(`${this.url}/keyword`, params);

        return data.results || [];
    };

    /**
     * Searches for movies based on the provided search query and year.
     * @returns A Promise that resolves to an array of Movie objects.
     */
    public async movie(): Promise<Movie[]> {
        TmdbClient.info(`Movie Search for: ${this.searchQuery}, year: ${this.year}`);

        const params = {
            params: {
                query: this.searchQuery,
                primary_release_year: this.year,
            },
        };

        const { data } = await this.get<PaginatedResponse<Movie>>(`${this.url}/movie`, params);

        const results = this.filter(data.results);

        return sortByMatchPercentage(results, 'title', this.searchQuery);
    };

    /**
     * Performs a multi search for a given query and year.
     * @returns A promise that resolves to an array of Person, Movie, or TvShow objects.
     */
    public async multi(): Promise<(Person | Movie | TvShow)[]> {
        TmdbClient.info(`Multi Search for: ${this.searchQuery}, year: ${this.year}`);

        const params = {
            params: {
                query: this.searchQuery,
                primary_release_year: this.year,
            },
        };

        const { data } = await this.get<PaginatedResponse<Person | Movie | TvShow>>(`${this.url}/multi`, params);

        return this.filter(data.results);

    };

    /**
     * Searches for person based on the provided query.
     * @returns A Promise that resolves to an array of Person objects.
     */
    public async person(): Promise<Person[]> {
        TmdbClient.info(`Person Search for: ${this.searchQuery}`);

        const params = {
            params: {
                query: this.searchQuery,
            },
        };

        const { data } = await this.get<PaginatedResponse<Person>>(`${this.url}/person`, params);

        return data.results;
    };

    /**
     * Searches for TV shows based on the provided query and year.
     * @returns A Promise that resolves to an array of TV shows.
     */
    public async tv(): Promise<TvShow[]> {
        let query = this.sanitizeQuery(this.searchQuery);

        TmdbClient.info(`TV Show Search for: ${query}, year: ${this.year}`);

        const params = {
            params: {
                query,
                first_air_date_year: this.year,
            },
        };

        const { data } = await this.get<PaginatedResponse<TvShow>>(`${this.url}/tv`, params);

        const results = this.filter(data.results);

        return sortByMatchPercentage(results, 'name', query);
    };

};

export default TmdbSearch;