

import TmdbClient from "./TmdbClient";
import type { TvCertification, TvCertifications } from "./types/certification/tv_certifications";
import type { MovieCertification, MovieCertifications } from "./types/certification/movie_certifications";

interface TmdbCertificationInterface {
    language?: string;
}

export interface CertificationList {
    iso_3166_1: string;
    meaning: string;
    order: number;
    certification: string;
}

/**
 * Represents a Certification from The Movie Database (TMDb).
 */
class TmdbCertification extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbCertificationInterface} [options] - The options to initialize the TmdbCertification instance with.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ language = i18next.language }: TmdbCertificationInterface = { language: i18next.language }) {
        super({ language });

        this.url = `certification`;
    }

    /**
     * Retrieves the certifications for both TV shows and movies from Tmdb.
     * @returns An object containing the certifications for TV shows and movies.
     */
    static async certifications(): Promise<Array<CertificationList>> {
        TmdbClient.info(`Fetching Certifications for TV Shows and Movies`);
        const data: Array<CertificationList> = [];

        const movieCertifications = new TmdbCertification().movieCertifications();
        const tvCertifications = new TmdbCertification().tvCertifications();

        await Promise.all([
            movieCertifications.then((certs) => {
                for (let i = 0; i < Object.keys(certs).length; i++) {
                    const key = Object.keys(certs)[i];
                    const certification = certs[key];

                    for (let j = 0; j < certification.length; j++) {
                        const cert = certification[j];
                        data.push({
                            iso_3166_1: key,
                            meaning: cert.meaning,
                            order: cert.order,
                            certification: cert.certification,
                        });
                    }
                }
            }),
            tvCertifications.then((certs) => {
                for (let i = 0; i < Object.keys(certs).length; i++) {
                    const key = Object.keys(certs)[i];
                    const certification = certs[key];

                    for (let j = 0; j < certification.length; j++) {
                        const cert = certification[j];
                        data.push({
                            iso_3166_1: key,
                            meaning: cert.meaning,
                            order: cert.order,
                            certification: cert.certification,
                        });
                    }
                }
            }),
        ]);

        return data;
    }

    /**
     * Retrieves the TV certifications from the TMDB API.
     * @returns A Promise that resolves to a TvCertification object.
     */
    async tvCertifications(): Promise<TvCertification> {
        TmdbClient.info(`Fetching TV Certifications`);

        const { data } = await this.get<TvCertifications>(`${this.url}/tv/list`);

        return data.certifications;
    };

    /**
     * Retrieves the movie certifications from the TMDB API.
     * @returns A Promise that resolves to a MovieCertification object.
     */
    async movieCertifications(): Promise<MovieCertification> {
        TmdbClient.info(`Fetching Movie ${this.id} Certifications`);

        const { data } = await this.get<MovieCertifications>(`${this.url}/movie/list`);

        return data.certifications;
    }

};

export default TmdbCertification;