import { LibraryItem } from '../base/library';
import { PaletteColors } from '../shared';

export enum State {
    idle = 'idle',
    loading = 'loading',
    ready = 'ready',
    error = 'error',
}
export enum PlayState {
    paused = 'paused',
    playing = 'playing',
}
export enum MutedState {
    unmuted = 'unmuted',
    muted = 'muted',
}

export interface Music {
    playlists: any[];
    audio: HTMLAudioElement;
    backLog: Song[];
    context: Context;
    currentSong: Song;
    currentSongIndex: number;
    crossfadeSteps: number;
    displayList: DisplayList;
    filteredList: Song[];
    durationState: number;
    fadeDuration: number;
    isCurrentDevice: boolean;
    lyrics: string;
    sortType: string;
    sortOrder: string;
    mutedState: string;
    playState: string;
    positionState: number;
    queue: Song[];
    showLyrics: boolean;
    shuffle: boolean;
    repeat: boolean;
    state: string;
    volumeState: number;
}

export enum MusicType {
    artist = 'artist',
    album = 'album',
    playlist = 'playlist',
    search = 'search',
    genre = 'genre',
}


export interface MusicCardPageResponse {
    type: string;
    data: MusicCardPageResponseData[];
}

export interface MusicCardPageResponseData {
    id: string;
    name: string;
    description: null;
    folder: string;
    cover: null | string;
    country: null | string;
    year: number | null;
    tracks: number;
    colorPalette: PaletteColors;
    blurHash: null | string;
    libraryId: string;
    Artist: Artist[];
    type: string;
    titleSort: string;
    origin: string;
}

export interface Artist {
    id: string;
    name: string;
    description?: string | null;
    cover: null | string;
    folder: string;
    colorPalette: PaletteColors | null;
    blurHash: null | string;
    libraryId: string;
    trackId: null;
}


export interface Song {
    id: string;
    name: string;
    track: number;
    disc: number;
    cover: string;
    folder: string;
    filename: string;
    duration: string;
    quality: number;
    path: string;
    lyrics: Lyric[] | null | string;
    colorPalette: PaletteColors;
    blurHash: string;
    folder_id: string;
    created_at: string;
    updated_at: string;
    album_track: Album[];
    artist_track: Album[];
    track_user: any[];
    type: string;
    favorite_track: boolean;
    origin: string;
    libraryId: string;
    album: Album;
    date: string;
}

export interface Album {
    id: string;
    name: string;
    folder: string;
    cover?: string;
    description: null;
    libraryId: string;
    origin: string;
    colorPalette: PaletteColors | null;
}

export interface Lyric {
    text: string;
    time: Time;
}

export interface Time {
    total: number;
    minutes: number;
    seconds: number;
    hundredths: number;
}


export interface ArtistResponse {
    id: string;
    name: string;
    description: null;
    folder: string;
    cover: string;
    colorPalette: PaletteColors;
    blurHash: string;
    created_at: string;
    updated_at: string;
    library_id: string;
    library: LibraryItem;
    type: string;
    track: Song[];
}

export interface AlbumResponse {
    id: string;
    name: string;
    description: null;
    folder: string;
    cover: string;
    country: string;
    year: number;
    tracks: number;
    colorPalette: PaletteColors;
    blurHash: null;
    created_at: string;
    updated_at: string;
    library_id: string;
    library: LibraryItem;
    album_artist: Artist;
    type: string;
    track: Song[];
}

export interface DisplayList {
    id: string;
    name: string;
    description?: string | null;
    favoriteArtist: boolean;
    cover: string | null;
    folder: string;
    colorPalette: PaletteColors;
    libraryId: string;
    trackId: null;
    track: Song[];
    album_artist: Artist | null;
    type: string;
}