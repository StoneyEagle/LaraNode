

import MusicbrainzClient from "./MusicbrainzClient";
import { ArtistWithAppends } from "./types/artist";
import { Covers, Image } from "./types/coverart";
import { RecordingWithAppends } from "./types/recording";
import { ReleaseWithAppends } from "./types/release";
import { ReleaseGroupWithAppends } from "./types/releaseGroup";

class Musicbrainz extends MusicbrainzClient {

    constructor() {
        super();
    }

    public async artist(id: string) {
        MusicbrainzClient.info(`Fetching Artist ${id}`);

        const artistAppend = [
            'genres',
            'recordings',
            'releases',
            'release-groups',
            'works',
        ] as const;

        const params = {
            params: {
                inc: [
                    'genres',
                    'recordings',
                    'releases',
                    'release-groups',
                    'works',
                ].join('+'),
            },
        };

        const { data } = await this.get<ArtistWithAppends<typeof artistAppend[number]>>(`artist/${id}`, params);

        return data;
    };

    public async recording(id: string) {
        MusicbrainzClient.info(`Fetching Recording ${id}`);

        const recordingAppend = [
            'aliases',
            'annotation',
            'artist-credit',
            'genres',
            'rating',
            'relations',
            'releases',
            'tags',
        ] as const;

        const params = {
            params: {
                inc: [
                    'artist-credits',
                    'artists',
                    'releases',
                    'tags',
                    'genres',
                ].join('+'),
            },
        };

        const { data } = await this.get<RecordingWithAppends<typeof recordingAppend[number]>>(`recording/${id}`, params);

        return data;
    };

    public async release(id: string) {
        MusicbrainzClient.info(`Fetching Release ${id}`);

        const releaseAppend = [
            'aliases',
            'annotation',
            'artist-credit',
            'collections',
            'genres',
            'label-info',
            'media',
            'relations',
            'release-group',
            'tags',
            'genres',
        ] as const;

        const params = {
            params: {
                inc: [
                    'artists',
                    'labels',
                    'recordings',
                    'release-groups',
                    'media',
                    'artist-credits',
                    'discids',
                    'puids',
                    'isrcs',
                    'artist-rels',
                    'label-rels',
                    'recording-rels',
                    'release-rels',
                    'release-group-rels',
                    'url-rels',
                    'work-rels',
                    'recording-level-rels',
                    'work-level-rels',
                    'annotation',
                    'aliases',
                    'artist-credits',
                    'collections',
                    'genres',
                    'tags',
                ].join('+'),
            },
        };

        const { data } = await this.get<ReleaseWithAppends<typeof releaseAppend[number]>>(`release/${id}`, params);

        return data;
    };

    public async releaseCover(id: string): Promise<Image[]> {
        const { data } = await this.axios.get<Covers>(`https://coverartarchive.org/release/${id}`);

        return data.images;
    };


    public async releaseGroup(id: string) {
        MusicbrainzClient.info(`Fetching Release Group ${id}`);

        const releaseAppend = [
            'artist-credits',
            'artists',
            'releases',
            'tags',
            'genres',
        ] as const;

        const params = {
            params: {
                inc: [
                    'artists',
                    'releases',
                    'tags',
                    'genres',
                ].join('+'),
            },
        };

        const { data } = await this.get<ReleaseGroupWithAppends<typeof releaseAppend[number]>>(`release-group/${id}`, params);

        return data;
    };

    public async releaseGroupCover(id: string) {
        const { data } = await this.axios.get<Covers>(`https://coverartarchive.org/release-group/${id}`);

        return data.images;
    };



};

export default Musicbrainz;