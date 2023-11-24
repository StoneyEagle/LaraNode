
export interface FingerprintLookup {
    results: Result[];
    status: string;
}

export interface Result {
    id: string;
    recordings: Recording[];
    score: Score;
}

export interface Recording {
    artists: Artist[];
    duration: number;
    id: string;
    releases: Release[];
    title: string;
}

export interface Artist {
    id: string;
    name: string;
}

export interface Release {
    artists?: Artist[];
    country: string;
    date: DateClass;
    id: string;
    medium_count: number;
    mediums: Medium[];
    releaseevents: ReleaseEvent[];
    title: string;
    track_count: number;
}

export interface DateClass {
    day?: number;
    month?: number;
    year: number;
}

export interface Medium {
    format: Format;
    position: number;
    track_count: number;
    tracks: Track[];
}

export enum Format {
    CD = 'CD',
    CopyControlCD = 'Copy Control CD',
    DigitalMedia = 'Digital Media',
    The12Vinyl = '12" Vinyl',
}

export interface Track {
    artists?: Artist[];
    id: string;
    position: number;
    title?: string;
}

export interface ReleaseEvent {
    country: string;
    date: DateClass;
}

export interface Score {
    value: string;
    type: string;
}
