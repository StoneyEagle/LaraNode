import { applicationPaths, configFile, tokenFile } from '../Helper/paths';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import Auth from '../Utils/Auth';
import ServiceProvider from '@framework/Providers/AuthServiceProvider';
import axios from 'axios';
import passportClient from 'laravel-passport-express';

class AuthServiceProvider extends ServiceProvider {
    public static baseUrl = 'https://dev.nomercy.tv';
    public static authBaseUrl: string = `${this.baseUrl}/oauth/`;
    public static tokenUrl: string = `${this.authBaseUrl}token`;
    private static passport: passportClient;

    private static public_key: string = '';

    private static token_client_id: string = '';
    private static token_client_secret: string = '';

    private static password_client_id: string = '';
    private static password_client_secret: string = '';

    constructor() {
        super();
    }

    public async register(): Promise<void> {
        await super.register();

        this.createAppFolders();

        await AuthServiceProvider.getAuthKeys().then(async () => {
            AuthServiceProvider.getPassport();

            const auth = new Auth({
                token_client_id: AuthServiceProvider.token_client_id,
                token_client_secret: AuthServiceProvider.token_client_secret,
                password_client_id: AuthServiceProvider.password_client_id,
                password_client_secret: AuthServiceProvider.password_client_secret,
            });

            await auth.refreshTokenLoop();
        });
    }

    public async boot(): Promise<void> {
        await super.boot();
    }

    private static getPassport() {
        if (!AuthServiceProvider.passport) {
            AuthServiceProvider.passport = passportClient({
                url: AuthServiceProvider.baseUrl,
                clientId: AuthServiceProvider.token_client_id,
                clientSecret: AuthServiceProvider.token_client_secret
            });
        }

        return AuthServiceProvider.passport;
    }

    private static async getAuthKeys() {

        const { data } = await axios.get(AuthServiceProvider.authBaseUrl, {
            headers: {
                'Accept-Encoding': 'gzip,deflate,compress',
                'Accept': 'application/json',
            },
        });

        AuthServiceProvider.public_key = data.public_key;

        AuthServiceProvider.token_client_id = data.server.token_client.client_id;
        AuthServiceProvider.token_client_secret = data.server.token_client.client_secret;

        AuthServiceProvider.password_client_id = data.server.password_client.client_id;
        AuthServiceProvider.password_client_secret = data.server.password_client.client_secret;

        return AuthServiceProvider;
    };

    public static requireAuth() {
        return AuthServiceProvider.getPassport().authToken();
    };

    public static optionalAuth() {
        return AuthServiceProvider.getPassport().authToken({
            requireAuth: false,
        });
    };

    public static enforceAuth() {
        return AuthServiceProvider.getPassport().requestToken();
    };

    private createAppFolders() {
        for (let i = 0; i < Object.values(applicationPaths).length; i++) {
            const path = Object.values(applicationPaths)[i];
            mkdirSync(path, { recursive: true });
        }

        if (!existsSync(tokenFile)) {
            writeFileSync(tokenFile, JSON.stringify({}));
        }
        if (!existsSync(configFile)) {
            writeFileSync(configFile, JSON.stringify({}));
        }
    }
}

export default AuthServiceProvider;