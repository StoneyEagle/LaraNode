
export interface GenresResponse {
    type: string;
    data: GenreItem[];
}

export interface GenreItem {
    id:               string;
    name:             string;
    musicGenre_track: MusicGenreTrack[];
    type:             string;
    titleSort:        string;
    origin:           string;
    blurHash:         string;
}

export interface MusicGenreTrack {
    musicGenre_id: string;
    track_id:      string;
}