export interface Info {
    status: string;
    data: Data;
}

export interface Data {
    state: string;
    version: string;
    copyright: string;
    licence: string;
    contact: Contact;
    git: string;
    keys: Keys;
    quote: string;
    colors: string[];
    downloads: Downloads;
}

export interface Keys {
    makemkv_key: string;
    omdb_key: string;
    tadb_key: string;
    tmdb_key: string;
    tmdb_token: string;
    tvdb_key: string;
    fanart_key: string;
    rotten_tomatoes: string;
    acoustic_id: string;
    musixmatch_key: string;
    jwplayer_key: string;
}

export interface Contact {
    homepage: string;
    name: string;
    email: string;
    dmca: string;
    languages: string;
    socials: Socials;
}

export interface Socials {
    twitch: string;
    youtube: string;
    twitter: string;
    discord: string;
}

export interface Downloads {
    windows: Download[];
    linux: Download[];
    mac: Download[];
}

export interface Download {
    name: string;
    path: string;
    url: string;
    last_updated: string;
    filter?: string;
}
