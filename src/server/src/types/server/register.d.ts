
export interface ServerRegisterResponse {
    success: boolean;
    server_id: string;
    url: string;
}

export interface LinkServer {
    access_token: string;
    refresh_token: string;
    token: Server;
}

export interface Server {
    is_owner: boolean;
    owner: string;
    internal_port: string;
    external_port: string;
    internal_donain: string;
    external_donain: string;
}

export interface ServerCertificate {
    success: boolean;
    certificate: string;
    private_key: string;
    issuer_certificate: string;
    certificate_authority: string;
}

export interface Moderator {
    id: string;
    name: string;
}