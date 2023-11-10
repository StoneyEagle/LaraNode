
export interface Token {
    id_token: string;
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface IDToken {
    aud:                string;
    iss:                string;
    iat:                number;
    exp:                number;
    sub:                string;
    name:               string;
    preferred_username: string;
    locale:             string|null;
    given_name:         string;
    family_name:        string;
    nickname:           string;
    email:              string;
    email_verified:     number;
}

export interface AccessToken {
    aud:    string;
    jti:    string;
    iat:    number;
    nbf:    number;
    exp:    number;
    sub:    string;
    scopes: string[];
    name:   string;
    email:  string;
}
