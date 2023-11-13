
export interface PaletteColors extends null {
    primary?: string;
    lightVibrant?: string;
    darkVibrant?: string;
    lightMuted?: string;
    darkMuted?: string;
}

export interface ColorPalettes {
    poster?: PaletteColors,
    backdrop?: PaletteColors,
    logo?: PaletteColors,
}

export interface Credits {
    cast: KnownFor[];
    crew: Crew[];
}

export interface Translations {
    translations: Translation[];
}

export interface Translation {
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    english_name: string;
    data: Data;
}

export interface Crew {
    adult: boolean;
    backdrop_path: null | string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: null | string;
    release_date: string;
    title: string;
    name: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credit_id: string;
    department?: string;
    job?: string;
    media_type?: string;
    poster: null | string;
    year?: number;
    character?: string;
    order?: number;
}

export interface Lolomo {
    id: number;
    title: string;
    year: number;
    haveEpisodes: number;
    overview: string;
    logo: string;
    backdrop: string;
    colorPalette: PaletteColors;
    rating: {
        iso31661: string; 
        rating: string;
    };
    videoId: string;
}


export interface Language {
    iso_639_1: string;
    english_name: string;
    name: string;
    label: string;
}

export interface Country {
    iso31661: string;
    english_name: string;
    label: string;
}
