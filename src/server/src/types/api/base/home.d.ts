import { ColorPalettes } from '../shared..dts';

export interface HomeResponse {
    data: HomeResponseItems[];
}

export interface HomeResponseItems {
    id: number;
    title: string;
    moreLink: string;
    items: HomeResponseItem[];
}

export interface HomeResponseItem {
    id: number;
    backdrop: null | string;
    overview: string;
    poster: string;
    title: string;
    name?: string;
    titleSort: string;
    type: string;
    year: number;
    mediaType: string;
    colorPalette: ColorPalettes;
    logo?: string;
    favorite?: boolean;
    watched?: boolean;
    numberOfEpisodes: number;
    haveEpisodes: number;
}

export interface ContinueWatching {
    id: number;
    mediaType: string;
    poster: string;
    backdrop: string;
    title: string;
    name?: string;
    titleSort: string;
    type: string;
    colorPalette: ColorPalettes;
    numberOfEpisodes: number;
    haveEpisodes: number;
    year: number;
    overview: string;
    logo: string;
    rating: {
        iso31661: string;
        rating: string;
    };
    videoId: string;
}
