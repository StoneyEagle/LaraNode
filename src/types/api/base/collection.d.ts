import { ColorPalettes } from "../shared";

export interface CollectionResponse {
    id: number;
    overview: string;
    backdrop: string;
    poster: string;
    title: string;
    titleSort: string;
    type: string;
    mediaType: string;
    favorite: boolean;
    watched: boolean;
    colorPalette: ColorPalettes;
    collection: Collection[];
}

export interface Collection {
    id: number;
    backdrop: string;
    mediaType: string;
    poster: string;
    title: string;
    name?: string;
    titleSort: string;
    type: string;
    colorPalette: ColorPalettes;
}