import { PaletteColors } from "../shared";

export interface AlbumsResponse {
    type: string;
    data: AlbumData[];
}

interface AlbumData {
    id: string;
    name: string;
    description: string | null;
    folder: string | null;
    cover: null | string;
    country: null | string;
    year: number | null;
    tracks: number | null;
    colorPalette: null | string;
    blurHash: null | string;
    libraryId: string;
    Artist: Artist[];
    type: string;
    titleSort: string;
    origin: string;
}

interface Artist {
    id: string;
    name: string;
    description: string | null;
    cover: null | string;
    folder: string | null;
    colorPalette: null | PaletteColors;
    blurHash: null | string;
    libraryId: string;
    trackId: string | null;
}

interface Count {
    track: number;
    Artist: number;
    File: number;
}
