import type { CreditsClass } from "@/types/server";
import { PaletteColors, Translations } from "../shared";

export interface PeopleResponse {
    nextId: number;
    people: Person[];
}

export interface Person {
    adult: boolean;
    alsoKnownAs: string;
    biography: string;
    birthday: string;
    createdAt: string;
    deathday: null | string;
    gender: number;
    homepage: null | string;
    id: number;
    imdbId: string;
    knownForDepartment: string;
    name: string;
    placeOfBirth: string;
    popularity: number;
    profile: string;
    updatedAt: string;
    colorPalette: ColorPalettes;
    poster: string;
    mediaType: MediaType;
}

export interface PersonResponse extends Person {
    Media: Media[];
    also_known_as: string[];
    imdb_id: string;
    known_for_department: string;
    place_of_birth: string;
    profile_path: string;
    credits: CreditsClass;
    combined_credits: Credits;
    movie_credits: Credits;
    tv_credits: Credits;
    external_ids: { [key: string]: null | string; };
    images: Images;
    translations: Translations;
    knownFor: KnownFor[];
}

export interface Credits {
    cast: Crew[];
    crew: Crew[];
}

export interface CreditsClass {
    cast: KnownFor[];
    crew: KnownFor[];
}


export interface KnownFor {
    adult: boolean;
    backdrop_path: null | string;
    character?: string;
    colorPalette: PaletteColors;
    credit_id: string;
    department?: string;
    episode_count?: number;
    first_air_date?: string;
    release_date?: string;
    genre_ids: number[];
    hasItem?: boolean;
    id: number;
    job?: string;
    media_type?: string;
    mediaType?: string;
    order?: number;
    origin_country?: string[];
    original_language: string;
    original_name?: string;
    original_title?: string;
    overview: string;
    popularity: number;
    poster_path: null | string;
    poster: null | string;
    name?: string;
    title?: string;
    type?: string;
    video?: boolean;
    vote_average: number;
    vote_count: number;
    year?: number;
}

export interface Images {
    profiles: Profile[];
}

export interface Profile {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: null;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface Credit {
    character?: string | null;
    job?: string | null;
    deathday: string | null;
    department?: string | null;
    gender: number | null;
    id: number;
    knownForDepartment: string | null;
    name: string | null;
    popularity: number | null;
    profilePath: string | null;
}