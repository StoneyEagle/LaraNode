import _express, { Application, Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import Router from '@framework/Routing/Router';
import compression from 'compression';
import axios from 'axios';
import { groupBy } from '@framework/Foundation/Helpers/array';

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

    protected port: number = 3000;
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
        
        this.applyMiddleWares(require(app_path('Http/Kernel.ts')).default.middleware);

        const shouldCompress = (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        };
        this.app.use(compression({ filter: shouldCompress }));
    
        this.app.enable('trust proxy');
        this.app.use(_express.json());
        this.app.use(_express.urlencoded({ extended: true }))
        this.app.set('view engine', 'ejs');
        
    }

    make_HttpServer() {
        this.server = http.createServer(this.app);
        return this;
    }

    make_HttpsServer(sslKey: string, sslCert: string, sslCA: string, allowHTTP1: boolean = true) {
        const credentials = {
            key: readFileSync(sslKey, 'utf-8'),
            cert: readFileSync(sslCert, 'utf-8'),
            ca: readFileSync(sslCA, 'utf-8'),
            allowHTTP1: allowHTTP1,
        };

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
        this.server.listen(this.port, this.ip, () => {
            console.log(`Server listening on ip: ${this.ip} and port: ${this.port}!`);
        });
        return this;
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
                    if(!method) {
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
                        (req,res,next) => this.runMiddleWares(req, res, next, route.getMiddleware()),
                        (req, res) => route.getCallback(req, res));

                });
            });

            this.app.use(group.getPrefix(),
            (req, res, next) => this.runMiddleWares(req, res, next, group.getMiddleware()), expressGroup);
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
        }[] = [];

        for (const route of this.routes) {

            const url = `${this.isHttps ? 'https' : 'http'}://localhost:${this.port}${route.path}`;
            console.log(`Testing ${route.method.toUpperCase()} ${url}`);
            await axios[route.method as keyof Method](url.replace(':id','1'))
                .then(() => {
                    result.push({
                        method: route.method,
                        group: route.group,
                        route: route.path, 
                        status: 'success',
                    });
                }).catch(({request}) => {
                    
                    if(request.res?.statusCode == 401 || request.res?.statusCode == 403 || request.res.url == '') {
                         result.push({
                            method: route.method,
                            group: route.group,
                            route: route.path, 
                            status: 'success'
                        });
                    } else {
                        result.push({
                            method: route.method,
                            group: route.group,
                            route: route.path, 
                            status: 'failed'
                        });
                    }
                })
        }

        console.table(`Successfully tested ${result.filter((r) => r.status == 'success').length} routes!`);
        console.table(result);
    }

    public showRoutes() {
        console.table(this.routes);
    }

    runMiddleWares(req: Request, res: Response, next: NextFunction, ...middlewares: any[]) {
        if(!middlewares.length) return next();

        middlewares.forEach((middleware) => {
            if(Array.isArray(middleware)) return this.runMiddleWares(req, res, next, ...middleware);
            
            if(typeof middleware === 'function') {
                const response = middleware(req, res, next);
                if(!response) {
                    next();
                }
            } else {
                const response = require(middleware).default(req, res, next);
                if(!response) {
                    next();
                }
            }
        });
    }
    
    applyMiddleWares(middlewares: Middleware[]) {
        middlewares.forEach((middleware: Middleware) => {
            if(typeof middleware === 'function') {
                middleware
                this.app.use((req: Request, res: Response, next: NextFunction) =>{
                    const response = middleware(req, res, next);
                    if(!response) {
                        next();
                    }
                });
            } else {
                this.app.use((req: Request, res: Response, next: NextFunction) => {
                    const response = require(middleware).default(req, res, next);
                    if(!response) {
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
        this.app[method](path, (req: Request, res: Response, next: NextFunction) => this.runMiddleWares(req, res, next, middlewares), callback);
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

    static getCountry(req: Request){
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

}

export default Express;