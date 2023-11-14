import { ColorPalettes } from '../shared';

export interface LibrariesResponse {
    id: string;
    autoRefreshInterval: number;
    chapterImages: number;
    extractChapters: number;
    extractChaptersDuring: number;
    image: null | string;
    perfectSubtitleMatch: number;
    realtime: number;
    specialSeasonName: string;
    title: string;
    type: string;
    country: string;
    language: string;
    blurHash: null;
    colorPalette: null;
    created_at: string;
    updated_at: string;
    folder_library: FolderLibrary[];
}

export interface FolderLibrary {
    folder_id: string;
    library_id: string;
    folder: Folder;
}

export interface Folder {
    id: string;
    path: string;
    created_at: string;
    updated_at: string;
}

export interface LibraryResponse {
    nextId: null;
    data: LibraryItem[];
}

export interface LibraryItem {
    id: number;
    backdrop: string;
    favorite: boolean;
    watched: boolean;
    logo: null | string;
    mediaType: string;
    numberOfEpisodes: number;
    haveEpisodes: number;
    overview: string;
    colorPalette: ColorPalettes;
    poster: string;
    title: string;
    titleSort: string;
    type: string;
    year: number;
}
