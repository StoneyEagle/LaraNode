import TmdbClient from "./TmdbClient";
import type { CollectionWithAppends } from "./types/collection/collection-details";
import type { CollectionImages } from "./types/collection/collection_images";
import type { CollectionTranslations } from "./types/collection/collection_translations";

interface TmdbCollectionsInterface {
    id: number;
    language?: string;
}

/**
 * Represents Collections from The Collection Database (TMDb).
 */
class TmdbCollections extends TmdbClient {

    /**
     * @constructor
     * @param {TmdbCollectionsInterface} [options] - The options to initialize the TmdbCollections instance with.
     * @param {number} [options.id] - The ID of the collection.
     * @param {string} [options.language] - The language to use for the tv Show data.
     */
    constructor({ id, language = i18next.language }: TmdbCollectionsInterface = { id: 0, language: i18next.language }) {
        super({ language });

        this.id = id;
        this.url = `collection/${id}`;
    }

    /**
     * Fetches the collection with the specified ID, along with additional information such as content ratings, credits, external IDs, images, and translations.
     * @returns A promise that resolves to the collection data.
     */
    async collection(): Promise<CollectionWithAppends<typeof collectionAppend[number]>> {
        TmdbClient.info(`Fetching Collection with id: ${this.id},`);

        const collectionAppend = [
            'content_ratings',
            'credits',
            'external_ids',
            'images',
            'translations'
        ] as const;

        const params = {
            params: {
                append_to_response: collectionAppend.join(','),
                include_image_language: `en,null,${this.language}`,
                include_video_language: `en,null,${this.language}`,
            },
        };

        const { data } = await this.get<CollectionWithAppends<typeof collectionAppend[number]>>(this.url, params);
        return data;
    }

    /**
     * Fetches the images for the collection.
     * @returns A Promise that resolves to a `CollectionImages` object.
     */
    async images(): Promise<CollectionImages> {
        TmdbClient.info(`Fetching Collection Images with id: ${this.id},`);

        const params = {
            params: {
                include_image_language: `en,null,${i18next.language}`,
            },
        };

        const { data } = await this.get<CollectionImages>(`${this.url}/images`, params);

        return data;
    };

    /**
     * Fetches the translations for the collection with the given ID.
     * @returns A Promise that resolves to the collection translations.
     */
    async translations(): Promise<CollectionTranslations> {
        TmdbClient.info(`Fetching Collection translations with id: ${this.id},`);

        const { data } = await this.get<CollectionTranslations>(`${this.url}/translations`);
        return data;
    };

};

export default TmdbCollections;