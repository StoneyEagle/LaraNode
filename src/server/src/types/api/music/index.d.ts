import { Album, Artist, Prisma } from '@prisma/client';
import { PaletteColors } from '../server/shared';

export interface MusicHomeResponse {
    title: string;
    moreLink: string;
    items: HomeDataItem[];
}

export interface HomeDataItem {
    id: string;
    name: string;
    description: null;
    cover: null | string;
    folder: string;
    colorPalette: PaletteColors | null;
    libraryId: string;
    trackId?: null;
    type: Type;
    title_sort?: string;
    origin?: string;
    country?: string | null;
    year?: number | null;
    tracks?: number;
    Artist?: (Artist & {
        _count: Prisma.ArtistCountOutputType;
    })[];
    Album?: (Album & {
        _count: Prisma.AlbumCountOutputType;
    })[];
}

export interface Count {
    track: number;
    Artist?: number;
    File?: number;
    Album?: number;
}

export enum Type {
    Album = 'album',
    Artist = 'artist',
    Genre = 'genre',
    Playlist = 'playlist',
}
