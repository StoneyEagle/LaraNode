import { PaletteColors } from '../shared';

export interface GenreResponse {
    id: string;
    name: string;
    type: string;
    titleSort: string;
    origin: string;
    track: Track[];
}

export interface Track {
    id: string;
    name: string;
    track: number | null;
    disc: number | null;
    cover: string | null;
    date: string | null;
    folder: string | null;
    filename: string;
    duration: string | null;
    quality: number | null;
    path: string;
    colorPalette: PaletteColors | null;
    blurHash: string | null;
    Album: Album[];
    Artist: Artist[];
    type: Type;
    favorite_track: boolean;
    artistId: string;
    origin: string;
    libraryId: string;
}

export interface Album {
    id: string;
    name: string;
    description: string | null;
    folder: string | null;
    cover: string | null;
    country: Country;
    year: number | null;
    tracks: number | null;
    colorPalette: PaletteColors | null;
    blurHash: string | null;
    libraryId: string;
}

export interface Artist {
    id: string;
    name: string;
    cover: string | null;
    description: string | null;
    folder: string | null;
    libraryId: string;
    origin: string;
    colorPalette: string | null;
}
