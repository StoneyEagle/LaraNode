
export interface PaginatedGenreResponse {
    'genre-count': number;
    'genre-offset': number;
    genres: Genre[];
}

export interface Genre {
    id: string;
    name: string;
    disambiguation: string;
}
