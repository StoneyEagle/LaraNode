import { PaletteColors } from "../shared";

export interface ArtistResponse {
    id: string;
    name: string;
    description: null | string;
    cover: null | string | undefined;
    folder: null | string;
    colorPalette: PaletteColors | null;
    blurHash: string | null;
    libraryId: string;
    trackId: null | string;
    _count: Count;
    type: string;
    track: Track[] | null;
}

export interface Count {
    Album: number;
    track: number;
}

export interface Track {
    id: string;
    name: string;
    track: number | null;
    disc: number | null;
    cover: null | string;
    date: null | string;
    folder: null | string;
    filename: string;
    duration: string | null;
    quality: number | null;
    path: string | null;
    colorPalette: PaletteColors | null;
    blurHash: null | string;
    Artist: Album[];
    Album: Album[];
    type: string;
    favorite_track: boolean;
    origin: string;
    libraryId: string;
}

export interface Album {
    id: string;
    name: string;
    folder: null | string;
    cover: null | string;
    description: null | string;
    libraryId: string;
    origin: string;
    colorPalette: null | string;
}

