import { existsSync, readFileSync, writeFileSync } from 'fs';
import http from 'http';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import axios from 'axios';
import open from 'open';
import { jwtDecode } from 'jwt-decode';
import { input, password } from '@inquirer/prompts';
import Logger from '@framework/Foundation/Logger';
import DetectBrowsers from '@framework/Foundation/Helpers/detectBrowsers';
import { configFile, tokenFile } from '../Helper/paths';

import type { Token } from '@framework/types/user';

class Auth {
    private tempServerEnabled: boolean = false;
    private authenticated: boolean = false;
    
    private baseUrl = 'https://dev.nomercy.tv';
    private authBaseUrl: string = `${this.baseUrl}/oauth/`;
    private authorizeUrl: string = `${this.authBaseUrl}authorize`;
    private tokenUrl: string = `${this.authBaseUrl}token`;

    private token_client_id: string;
    private token_client_secret: string;
    private password_client_id: string;
    private password_client_secret: string;

    private authorizationScopes: string = 'openid profile email';
    private codeVerifier: string = '';

    private access_token: string = '';
    private refresh_token: string = '';
    private expires_in: number = 0;
    private refresh_expires_in: number = 0;
    private token_type: string = '';
    private id_token: string = '';
    private session_state: string = '';
    private scope: string = '';
    
    constructor({ token_client_id, token_client_secret, password_client_id, password_client_secret }) {

        this.token_client_id = token_client_id;
        this.token_client_secret = token_client_secret;
        this.password_client_id = password_client_id;
        this.password_client_secret = password_client_secret;

        this.access_token = Auth.getAccessToken();
        this.refresh_token = Auth.getRefreshToken();
        this.expires_in = Auth.getTokenExpiration();
        this.id_token = Auth.getIdToken();

        this.refreshTokenLoop();
    }

    private async refreshTokenLoop() {
        this.refreshToken();

        const interval = setTimeout(async () => {
            await this.refreshTokenLoop();
        }, this.expires_in ?? 60000);

        return interval;
    }

    private async refreshToken(){
        this.info('Refreshing offline token');
    
        if (!this.refresh_token) {
            console.log('No refresh token found');

            if(!this.tempServerEnabled) {
                this.tempServer(serverPort()+1);
                this.loginByBrowser();
            }

            return;
        }
        
        const refreshTokenData = this.setTokenData({
            grant_type: 'refresh_token',
            refresh_token: this.refresh_token,
        });
    
		const response = await fetch(this.tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: refreshTokenData.toString(),
		});

		const data = await response.json();

		if (data.error) {
			throw new Error(data.error_description);
		}	

        this.setAuthTokens(data);
        
        if (data.access_token) {
            writeFileSync(tokenFile, JSON.stringify(data));
    
            this.info('Offline token refreshed');
        }

        return data;
    }

    public async aquireToken() {

        const detected = DetectBrowsers();

        if (detected) {
            return this.loginByBrowser();
        } else {
            return this.loginByPassword();
        }
        
    };

    private async loginByBrowser() {
        const redirect_uri = `${serverHost()}:${serverPort()+1}/sso-callback`;

		return new Promise(async (resolve, reject) => {

			this.info('Opening browser, please login');

			await open(await this.authorizeUrlString(redirect_uri), {
				wait: true,
			});

			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
    }
    
    private async loginByPassword() {

        return new Promise(async (resolve, reject) => {

            const { email, password, totp } = await this.loginPrompt();

            const passwordGrantData = this.setTokenData({
                client_id: this.password_client_id,
                client_secret: this.password_client_secret,
                grant_type: 'password',
                username: email,
                password: password,
                totp: totp,
            });

            // console.log('passwordGrantData', passwordGrantData);

            await axios.post<Token>(this.tokenUrl, passwordGrantData.toString())
                .then(({ data }) => {
                    this.info('Server authenticated');

                    this.setAuthTokens(data);

                    const userId = jwtDecode(data.access_token).sub as string;
                    this.writeToConfigFile('user_id', userId);

                    if (data.access_token) {
                        writeFileSync(tokenFile, JSON.stringify(data, null, 2));
                    }
                })
                .then(async () => {
                    resolve(true);
                })
                .catch(({ response }) => {
                    this.error(response.data);
                    reject(new Error(response.data));
                });
        });
    };
    
    private loginPrompt(): Promise<{ email: string, password: string, totp: string }> {
        return new Promise(async (resolve) => {

            console.log('Please login to continue');

            const email = await input({
                message: 'Email address'
            });

            const pass = await  password({
                message: 'Password: '
            });

            const totp = await input({
                message: '2fa code: ', 
                validate: (value: string) => !value || !isNaN(parseInt(value, 10)),
            });

            resolve({
                email: email,
                password: pass,
                totp: totp,
            });
        });
    };

    private async authorizeUrlString(redirect_uri: string) {
   
        const pkce = await this.generatePKCE();
        
        this.codeVerifier = pkce.codeVerifier;
    
        const queryParams = this.setTokenData({
            redirect_uri: redirect_uri,
            response_type: 'code',
            state: pkce.state,
            code_challenge: pkce.codeChallenge,
            code_challenge_method: 'S256',
        });

        // console.log(this.authorizeUrl, queryParams);
    
        return this.authorizeUrl + '?' + queryParams;
    }

    private writeToConfigFile(key: string, value: string) {
        if (!existsSync(configFile)) {
            writeFileSync(configFile, JSON.stringify({}));
        }
    
        const data = JSON.parse(readFileSync(configFile, 'utf8'));
    
        data[key] = value;
    
        writeFileSync(configFile, JSON.stringify(data));
    };    

    private generateCodeVerifier(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    private async generateCodeChallenge(codeVerifier: string) {

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashBase64 = this.base64URLEncode(hashArray);
        return hashBase64;
    }

    private base64URLEncode(data: number[]) {
        return btoa(String.fromCharCode.apply(null, data))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    private async generatePKCE() {
        const state = this.generateCodeVerifier(40);
        const verifier = this.generateCodeVerifier(128);    
        const challenge = await this.generateCodeChallenge(verifier);

        return {
            state: state,
            codeVerifier: verifier,
            codeChallenge: challenge,
        };
    }

    private makeTokenData(){
        return new URLSearchParams({
            client_id: this.token_client_id,
            client_secret: this.token_client_secret,
            scope: this.authorizationScopes,
        });
    }

    private setTokenData(val: {[key:string]: string}){ 
        const tokenData = this.makeTokenData();
        Object.entries(val).forEach(([key, value]) => {
            tokenData.set(key, value);
        });
        return tokenData;
    }


    private tempServer(internal_port: number) {
	
        const app = express();
        const httpServer = http.createServer(app);

        app.get('/sso-callback', this.callback.bind(this));

        httpServer
            .listen(internal_port, '0.0.0.0', () => {
                console.log(`listening on port ${internal_port}`);
                this.tempServerEnabled = true;
            })
            .on('error', (error) => {
                this.error(`Sorry Something went wrong starting the server: ${JSON.stringify(error, null, 2)}`);
                process.exit(1);
            })
            .on('close', () => {
                this.tempServerEnabled = false;
            });

        return httpServer;
    };
    
    private async callback(req: Request, res: Response) {
        const redirect_uri = `${serverHost()}:${serverPort()+1}/sso-callback`;

        const authorizationCodeParams = this.setTokenData({
            grant_type: 'authorization_code',
            code: req.query.code as string,
            redirect_uri: redirect_uri,
            code_verifier: this.codeVerifier,
        });

        // console.log(this.tokenUrl, authorizationCodeParams);

        await axios
            .post<Token>(this.tokenUrl, authorizationCodeParams.toString())
            .then(({ data }) => {
                this.info('Server authenticated');

                this.setAuthTokens(data);

                const userId = jwtDecode(data.access_token).sub as string;
                this.writeToConfigFile('user_id', userId);

                if (data.access_token) {
                    writeFileSync(tokenFile, JSON.stringify(data, null, 2));
                }

                res.send('<script>window.close();</script>').end();
            })
            .catch(({ response }) => {
                this.error(response.data);
                return res.json(response.data);
            });
    }

    private setAuthTokens(data: Token) {
        this.access_token = data.access_token;
        this.refresh_token = data.refresh_token;
        this.expires_in = data.expires_in;
        this.refresh_expires_in = data.refresh_expires_in;
        this.token_type = data.token_type;
        this.id_token = data.id_token;
        this.session_state = data.session_state;
        this.scope = data.scope;

        globalThis.access_token = this.access_token;
        globalThis.refresh_token = this.refresh_token;
        globalThis.expires_in = this.expires_in;
        globalThis.refresh_expires_in = this.refresh_expires_in;
        globalThis.token_type = this.token_type;
        globalThis.id_token = this.id_token;
        globalThis.session_state = this.session_state;
        globalThis.scope = this.scope;
    }

    public static getAccessToken = (): string => {
        return JSON.parse(readFileSync(tokenFile, 'utf-8'))?.access_token as string;
    }

    public static getRefreshToken = (): string => {
        return JSON.parse(readFileSync(tokenFile, 'utf-8'))?.refresh_token as string;
    }

    public static getIdToken = (): string => {
        return JSON.parse(readFileSync(tokenFile, 'utf-8'))?.id_token as string;
    }

    public static getTokenExpiration = (): number => {
        return JSON.parse(readFileSync(tokenFile, 'utf-8'))?.expires_in as number;
    }

    private info(message: string) {
        Logger.log({
            level: 'info',
            name: 'auth',
            color: 'blueBright',
            message: message,
        });
    }

    private error(message: string) {
        Logger.log({
            level: 'error',
            name: 'auth',
            color: 'red',
            message: JSON.stringify(message, null, 2),
        });
    }

}

export default Auth;