

import TmdbClient from "./TmdbClient";
import { CompanyAlternatetiveNames } from "./types/company/company_alternatetive_names";
import { CompanyDetails, CompanyWithAppends } from "./types/company/company_details";
import { CompanyImages } from "./types/company/company_images";

interface TmdbCompanyInterface {
    id: number;
    language?: string;
}

/**
 * Represents a Company from The Movie Database (TMDb).
 */
class TmdbCompany extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbCompanyInterface} [options] - The options to initialize the TmdbCompany instance with.
     * @param {number} [options.id] - The ID of the collection.
     * @param {string} [options.language] - The language to use for the company data.
     */
    constructor({ id, language = i18next.language }: TmdbCompanyInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;
        this.url = `company/${id}`;
    }

    async allDetails() {

        const companyAppend = [
            'alternative_names',
            'images',
        ] as const;

        TmdbClient.info(`Fetching Company ${this.id} Details including ${companyAppend.join(', ')}`);

        const params = {
            params: {
                append_to_response: companyAppend.join(','),
                include_image_language: `en,null,${this.language}`,
            }
        };

        const { data } = await this.get<CompanyWithAppends<typeof companyAppend[number]>>(this.url, params);

        return data;
    }

    async details(): Promise<CompanyDetails> {

        TmdbClient.info(`Fetching Company ${this.id} Details`);

        const { data } = await this.get<CompanyDetails>(this.url);

        return data;
    }

    async alternativeNames(): Promise<CompanyAlternatetiveNames> {
        TmdbClient.info(`Fetching Company ${this.id} Alternative Names`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<CompanyAlternatetiveNames>(`${this.url}/alternative_names`, params);

        return data;
    };

    async images(): Promise<CompanyImages> {
        TmdbClient.info(`Fetching Company ${this.id} Images`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<CompanyImages>(`${this.url}/images`, params);

        return data;
    };
};

export default TmdbCompany;