import _express, { Application, Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import Router from '@framework/Routing/Router';
import compression from 'compression';
import axios from 'axios';

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
        callback: (req: Request, res: Response, next: NextFunction) => void,
    }[] = [];

    constructor() {
        this.app = _express();

        // this.app.use(
        //     cors({
        //         // origin: origins,
        //         origin: '*',
        //     })
        // );
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

        return this;
    }

    public testRoutes() { 
        for (const route of this.listRoutes()) {
            const url = `${this.isHttps ? 'https' : 'http'}://localhost:${this.port}${route.path}`;

            axios[route.method as keyof Method](url.replace(':id','1'))
                .then(() => {
                    console.log(`route: ${route.path} is working`);
                }).catch(({request}) => {
                    if(request.res?.statusCode == 401) {
                         console.log(`route: ${route.path} is working`);
                    } else {
                        console.log(`route: ${route.path} is not working`);
                    }
                })
        }
    }

    public showRoutes() {
        // console.log(express.app._router.stack.filter((r: any) => r.name == 'router').map((r: any) => r.handle));

        console.table(this.listRoutes());
    }

    runMiddleWares(req: Request, res: Response, next: NextFunction, middlewares: Middleware[]) {
        if(!middlewares.length) return next();

        middlewares.forEach((middleware) => {
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

    addRoute(method: Method, path: string, middlewares: Middleware[], callback: (req: any, res: any) => void) {
        this.app[method](path, (req: Request, res: Response, next: NextFunction) => this.runMiddleWares(req, res, next, middlewares), callback);
        return this;
    }

    addGroupRoute(exressRouter: Router, method: Method, path: string, middlewares: Middleware[], callback: (req: any, res: any) => void) {
        exressRouter[method](path, (req: Request, res: Response, next: NextFunction) => this.runMiddleWares(req, res, next, middlewares), callback);
        return this;
    }

    public listRoutes() {
        return this.routes;
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