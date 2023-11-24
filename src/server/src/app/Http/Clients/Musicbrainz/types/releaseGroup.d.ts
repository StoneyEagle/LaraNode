import { Genre } from "./genre";
import { Artist, Release, Tag } from "./release";
import { ArtistCredit } from "./resource";

export interface ReleaseGroups {
    created: string;
    count: number;
    offset: number;
    "release-groups": ReleaseGroup[];
}
export interface ReleaseGroup {
    disambiguation: string,
    id: string;
    score: number;
    title: string;
    'first-release-date': number;
    "primary-type-id": string;
    "primary-type": string;
    "secondary-type-ids": []
    "secondary-types": [],
    "type-id": string;
}

export interface ReleaseGroupAppend extends ReleaseGroup {
    'artist-credits': ArtistCredit[],
    artists: Artist[],
    genres: Genre[],
    releases: Release[],
    tags: Tag[],
}

export type ReleaseGroupWithAppends<T extends keyof ReleaseGroupAppend> = ReleaseGroup & Pick<ReleaseGroupAppend, T>;
