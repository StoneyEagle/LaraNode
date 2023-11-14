import { ColorPalettes, PaletteColors } from "../shared";

export interface InfoResponse {
    id: number;
    duration: number | null;
    backdrop: string | null;
    logo: string | null;
    poster: string | null;
    title: string;
    name?: string;
    overview: string | null;
    titleSort: string;
    voteAverage: number | null;
    contentRatings: any[];
    year: number;
    numberOfEpisodes?: number;
    haveEpisodes?: number;
    backdrops: MediaItem[];
    posters: MediaItem[];
    logos: MediaItem[];
    genres: Item[];
    creators: Item[];
    directors: Item[];
    writers: Item[];
    keywords: string[];
    budget?: number | null;
    type: string;
    mediaType: string;
    favorite: boolean;
    watched: boolean;
    externalIds: {
        imdbId: string | null;
        tvdbId: number | null;
    };
    cast: InfoCredit[];
    crew: InfoCredit[];
    director: Item[];
    colorPalette?: ColorPalettes;

    videos: ExtendedVideo[];
    similar: any[];
    recommendations: any[];
    seasons: any[];
}

export interface MediaItem {
    blurHash: string;
    aspectRatio: number;
    createdAt: string;
    height: number;
    id: number;
    iso6391: string | null;
    name: string | null;
    site: string | null;
    size: string | null;
    profilePath?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    src: string;
    type: string;
    updatedAt: string;
    voteAverage: number;
    voteCount: number;
    width: number;
    colorPalette: PaletteColors;
}

export interface Video {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    src: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

export interface ExtendedVideo extends Video {
    src: string;
    site: string;
}