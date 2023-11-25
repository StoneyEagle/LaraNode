import _express, { Application, Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import Router from '@framework/Routing/Router';
import compression from 'compression';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { groupBy } from '@framework/Foundation/Helpers/array';
import { deviceId } from '@/app/Helper/system';

export type Method = keyof typeof MethodEnum;
export enum MethodEnum {
    all = "all",
    get = "get",
    post = "post",
    put = "put",
    delete = "delete",
    patch = "patch",
    options = "options",
    head = "head",
}

export type Middleware = string | ((req: Request, res: Response, next: NextFunction) => void | Response);

class Express {

    protected port: number = serverPort();
    protected ip: string = '0.0.0.0';

    public server: http.Server | https.Server | undefined;
    public app: Application;
    protected isHttps: boolean = false;

    protected routes: {
        method: Method,
        path: string,
        group: string | undefined,
        name: string | undefined,
        callback: (req: Request, res: Response, next: NextFunction) => void,
    }[] = [];

    constructor() {
        this.app = _express();

        this.applyMiddleWares(require(app_path("Http/Kernel")).middleware);

        const shouldCompress = (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        };
        this.app.use(compression({ filter: shouldCompress }));

        this.app.enable('trust proxy');
        this.app.use(_express.json());
        this.app.use(_express.urlencoded({ extended: true }));
        this.app.set('view engine', 'ejs');

    }

    make_HttpServer() {
        process.env.SERVER_HOST = `http://${globalThis.internalIp}:${this.port}`;

        this.server = http.createServer(this.app);
        return this;
    }

    make_HttpsServer({ key, cert, ca, allowHTTP1 = true }: { key: string, cert: string, ca: string, allowHTTP1: boolean; }) {
        const credentials = {
            key: readFileSync(key, 'utf-8'),
            cert: readFileSync(cert, 'utf-8'),
            ca: readFileSync(ca, 'utf-8'),
            allowHTTP1: allowHTTP1,
        };

        process.env.SERVER_HOST = `https://${globalThis.internalIp.replace(/\./g, '-')}.${deviceId}.nomercy.tv:${this.port}`;

        this.server = https.createServer(credentials, this.app);

        this.isHttps = true;
        return this;
    }

    setPort(port: number) {
        this.port = port;
        return this;
    }

    setIp(ip: string) {
        this.ip = ip;
        return this;
    }

    startServer() {
        if (!this.server) {
            throw new Error('Server is not defined!');
        }
        return new Promise((resolve, reject) => {
            this.server!.listen(this.port, this.ip, () => {
                this.running(this.isHttps);
                resolve(this);
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    stopServer(cb: (err?: Error | undefined) => void) {
        if (!this.server) {
            throw new Error('Server is not defined!');
        }
        return this.server.close(cb);
    }

    restartServer() {
        this.stopServer((err) => {
            if (err) {
                console.error(err);
            }

            this.startServer();
        });
        return this;
    }

    router() {
        return _express.Router({ mergeParams: true });
    }

    group(callback: (router: ExpressRouter) => void) {
        const router = _express.Router({ mergeParams: true });
        callback(router);
        return router;
    };

    sanitizeUri(uri: string) {
        return `/${uri}`.replace(/\/+/g, '/');
    }

    addRoutes(routers: Router[]) {
        routers.forEach((group) => {
            const expressGroup = this.group((exressRouter) => {
                group.getRoutes().forEach((route) => {
                    const method = route.getMethod();
                    if (!method) {
                        throw new Error('Method is not defined!');
                    }

                    this.routes.push({
                        method: method,
                        name: route.getName(),
                        group: group.getPrefix(),
                        path: this.sanitizeUri(group.getPrefix() + route.getPrefix() + route.getUri()),
                        callback: route.getCallback,
                    });

                    exressRouter[method](this.sanitizeUri(route.getPrefix() + route.getUri()),
                        this.setId,
                        (req, res, next) => this.runMiddleWares(req, res, next, ...route.getMiddleware()),
                        (req, res) => route.getCallback(req, res));

                });
            });

            this.app.use(group.getPrefix(),
                (req, res, next) => this.runMiddleWares(req, res, next, ...group.getMiddleware()), expressGroup);
        });

        this.app.get('*', (req: Request, res: Response) => {
            const urlMatch = this.routes.filter((route) => route.path == req.path).map((route) => route.method.toUpperCase());

            urlMatch.length > 0
                ? res.status(405).send(`The ${req.method} method is not supported for route ${req.path}. Supported methods: ${urlMatch.join(', ')}.`)
                : res.status(404).send(`The route ${req.path} could not be found.`);
        });

        return this;
    }

    public async testRoutes() {

        const result: {
            method: Method,
            group: string | undefined,
            route: string,
            status: 'success' | 'failed',
            duration: string,
        }[] = [];

        let request: <T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: AxiosRequestConfig<D> | undefined) => Promise<R>;

        const startTimer = Date.now();

        for (const route of this.routes) {

            const interval = Date.now();

            const url = `${process.env.INTERNAL_DOMAIN}/${route.path}`;
            console.log(`Testing ${route.method.toUpperCase()} ${url}`);

            if (route.method == 'get') {
                request = axios.get;
            } else if (route.method == 'post') {
                request = axios.post;
            } else if (route.method == 'put') {
                request = axios.put;
            } else if (route.method == 'delete') {
                request = axios.delete;
            } else if (route.method == 'patch') {
                request = axios.patch;
            } else if (route.method == 'options') {
                request = axios.options;
            } else if (route.method == 'head') {
                request = axios.head;
            } else {
                request = axios.get;
            }

            await request(url.replace(':id', '1'))
                .then(() => {
                    result.push({
                        method: route.method,
                        group: route.group,
                        route: route.path,
                        status: 'success',
                        duration: `${Date.now() - interval}ms`,
                    });
                }).catch(({ request }) => {

                    if (request.res?.statusCode == 401 || request.res?.statusCode == 403 || request.res?.url == '') {
                        result.push({
                            method: route.method,
                            group: route.group,
                            route: route.path,
                            status: 'success',
                            duration: `${Date.now() - interval}ms`,
                        });
                    } else {
                        result.push({
                            method: route.method,
                            group: route.group,
                            route: route.path,
                            status: 'failed',
                            duration: `${Date.now() - interval}ms`,
                        });
                    }
                });
        }

        result.push({
            method: 'all',
            group: '',
            route: `Successfully tested ${result.filter((r) => r.status == 'success').length} routes!`,
            status: 'success',
            duration: `${Date.now() - startTimer}ms`,
        });

        console.table(result);
    }

    public showRoutes() {
        console.table(this.routes);
    }

    runMiddleWares(req: Request, res: Response, next: NextFunction, ...middlewares: Middleware[]) {
        if (!middlewares.length) return next();

        middlewares.forEach((middleware) => {
            if (Array.isArray(middleware)) return this.runMiddleWares(req, res, next, ...middleware);

            if (typeof middleware === 'function') {
                const response = middleware(req, res, next);
                if (!response) {
                    next();
                }
            } else {
                // @ts-ignore
                const response = require(middleware)(req, res, next);
                if (!response) {
                    next();
                }
            }
        });
    }

    applyMiddleWares(middlewares: Middleware[]) {
        middlewares.forEach((middleware: Middleware) => {
            if (typeof middleware === 'function') {
                this.app.use((req: Request, res: Response, next: NextFunction) => {
                    const response = middleware(req, res, next);
                    if (!response) {
                        next();
                    }
                });
            } else {
                this.app.use((req: Request, res: Response, next: NextFunction) => {
                    const response = require(middleware)(req, res, next);
                    if (!response) {
                        next();
                    }
                });
            }
        });

        return this;
    }

    setId(req: Request, res: Response, next: NextFunction) {
        req.id = req.params?.id ?? req.body?.id ?? req.query?.id ?? null;

        next();
    }

    addRoute(method: Method, path: string, middlewares: Middleware[], callback: (req: Request, res: Response) => void) {
        this.app[method](path, (req: Request, res: Response, next: NextFunction) => this.runMiddleWares(req, res, next, ...middlewares), callback);
        return this;
    }

    public listRoutes() {
        return groupBy(this.routes, 'group');
    }

    static getLanguage(req: Request) {
        if (
            !req.acceptsLanguages()
            || !req.acceptsLanguages()[0]
            || req.acceptsLanguages()[0] == '*'
            || req.acceptsLanguages()[0] == 'undefined'
        ) {
            return 'en';
        }
        return req.acceptsLanguages()[0].split('-')[0] ?? 'en';
    };

    static getCountry(req: Request) {
        if (
            !req.acceptsLanguages()
            || !req.acceptsLanguages()[0]
            || req.acceptsLanguages()[0] == '*'
            || req.acceptsLanguages()[0] == 'undefined'
        ) {
            return 'US';
        }
        return req.acceptsLanguages()[0].split('-')[1] ?? 'US';
    }

    static auth() {

    }

    public running(secure: boolean = false) {
        console.log(`Server listening on ip: ${this.ip} and port: ${this.port}!`);
    }

}

export default Express;