import { Middleware } from "@framework/Server/Express";
import Route from "./Route";
import { Response } from 'express';
import { existsSync } from "fs";
import { resolve } from "path";

export interface RouteGroupAttributes {
    prefix?: string;
    middleware?: string[];
    namespace?: string;
}

export const _routers: Router[] = [];

export type MyResponse = {
    json: (value: unknown, headers?: { [key: string]: string | number; }) => Response;
    send: (value: unknown, headers?: { [key: string]: string | number; }) => Response;
    view: (value: unknown, headers?: { [key: string]: string | number; }) => Response;
    redirect: (value: unknown, headers?: { [key: string]: string | number; }) => Response;
    status: (value: unknown, headers?: { [key: string]: string | number; }) => Response;
};

class Router {

    protected static instance;

    protected _middlewares: string[] = [];
    protected _domain: string = '';
    protected _prefix: string = '';
    protected _routes: Route[] = [];
    protected static parentRouter: Router | null = null;

    constructor() {
    }

    getMiddleware(): Middleware[] {
        return this?._middlewares ?? Router.instance?._middlewares;
    }

    getDomain() {
        return this._domain;
    }

    getPrefix() {
        return this._prefix;
    }

    getRoutes() {
        return this._routes;
    }

    public static middleware(name: string | string[]): Router {
        Router.instance = new Router();

        _routers.push(Router.instance);

        return Router.instance.middleware(name);
    }

    public middleware(name: string | string[]) {
        const files: string[] = [];

        if (Array.isArray(name)) {
            name.forEach((item) => {
                const middleware = app_path(`Http/Middleware/${item}`);
                if (this.hasFile(`${middleware}`)) {
                    files.push(`${middleware}`);
                } else {
                    files.push(resolve(__dirname, '..', 'Middleware', item.toTitleCase()));
                }
            });
        } else {
            name.split(',').forEach((item) => {
                const middleware = app_path(`Http/Middleware/${item}`);
                if (this.hasFile(`${middleware}`)) {
                    files.push(`${middleware}`);
                } else {
                    files.push(resolve(__dirname, '..', 'Middleware', item.toTitleCase()));
                }
            });
        }

        this._middlewares.push(...files);

        return this;
    }

    hasFile(file: string) {
        return existsSync(app_path(`${file}`) + '.ts') || existsSync(app_path(`${file}`) + '.js');
    }

    public static group(arg0: { prefix?: string; middleware?: string[]; namespace?: string; }, arg1: (arg0) => void) {
        if (!Router.parentRouter) {
            Router.parentRouter = Router.instance;
        }

        const instance = new Router();
        instance._prefix = Router.instance._prefix;

        _routers.push(instance);

        Router.instance = instance;

        return Router.instance.group(arg0, arg1);
    }

    public group(attributes: string): this;
    public group(attributes: RouteGroupAttributes, routes: () => unknown): this;
    public group(attributes: any, routes?: any): this {

        if (typeof attributes === 'string') {
            require(attributes);
        } else if (typeof attributes === 'object') {
            this.prefix(attributes.prefix);

            this.middleware(attributes.middleware ?? []);
            this._domain = attributes.domain;

            routes();

            this.reset();
        }

        return this;
    }

    private reset() {
        Router.instance = Router.parentRouter;
        Router.parentRouter = null;
    }

    public domain(domain: string) {
        this._domain = domain;

        return this;
    }

    public prefix(prefix: string) {
        this._prefix += '/' + prefix + '/';
        this._prefix = this._prefix.replace(/\/+/g, '/');

        return this;
    }

    public static routerList() {
        return _routers ?? [];
    }
}

export default Router;
