import { PaletteColors } from "../shared";

export interface AlbumResponse {
    id: string;
    name: string;
    description: string | null;
    folder: string | null;
    cover: string | null;
    country: string | null;
    year: number | null;
    tracks: number | null;
    colorPalette: PaletteColors | null;
    blurHash: string | null;
    libraryId: string;
    Artist: Artist[] | null;
    type: string;
    track: Track[];
}

interface Artist {
    id: string;
    name: string;
    description: string | null;
    cover: string | null;
    folder: string | null;
    colorPalette: string | null;
    blurHash?: string | null;
    libraryId: string;
    trackId?: string | null;
    origin: string;
}

interface Count {
    track: number;
    Artist: number;
    File: number;
}

interface Track {
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
    Artist: Artist[];
    Album: Album[];
    type: string;
    favorite_track: boolean;
    artistId: string;
    origin: string;
    libraryId: string;
}

interface Album {
    id: string;
    name: string;
    description: string | null;
    folder: string | null;
    cover: string | null;
    country: string | null;
    year: number | null;
    tracks: number | null;
    colorPalette: string | null;
    blurHash: string | null;
    libraryId: string;
}
