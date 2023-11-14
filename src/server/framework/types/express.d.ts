
declare module 'express-serve-static-core' {
    interface Request extends Express.Request {
        language: string;
        country: string;

        user: IDToken;
        access_token: string;
        id: string;
    }
}

export { };