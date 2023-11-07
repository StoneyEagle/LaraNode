import Router from '@framework/Routing/Router';
import BaseController from '@framework/Routing/Controller';
import { NextFunction, Request, Response } from 'express';
import { Method, MethodEnum } from '@framework/Server/Express';

type MyResponse = {
    json: (value: any, headers?: { [key: string]: string | number; }) => void | Response | Response<any, Record<string, any>>;
    send: (value: any, headers?: { [key: string]: string | number; }) => void | Response | Response<any, Record<string, any>>;
    view: (value: any, headers?: { [key: string]: string | number; }) => void | Response | Response<any, Record<string, any>>;
    redirect: (value: any, headers?: { [key: string]: string | number; }) => void | Response | Response<any, Record<string, any>>;
    status: (value: number) => typeof Route;
};

type ActionType = string | typeof BaseController | (({ req, res, next, response }: { req: Request, res: Response, next: NextFunction, response: MyResponse; }) => Response);

type Action = {
    req: Request,
    res: Response,
    next: NextFunction,
    response: MyResponse;
};

class Route extends Router {

    protected static instance: Router;

    protected _name: string = '';
    protected _where: string[] = [];
    protected _action: ActionType = '';
    protected _uri: string = '';
    protected _method: Method = MethodEnum.get;

    constructor() {
        super();
        Route.instance = this;
    }

    getCallback(req: Request, res: Response) {
        const controller = this._action[0] ?? this._action;
        const action = this._action[1];

        if (typeof controller === 'function') {

            return controller({ req, res, response: Route.response(res) });

        } else if (typeof controller === 'string') {

            const exec = new (require(controller).default)(req, res);
            // find model from this request and set it to the controller
                        
            return exec[action](req.params?.id ?? req.body?.id ?? req.query?.id ?? null);
        }
    }

    public static response(res: Response): MyResponse {
        return {
            json: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.json(value);
            },
            send: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.send(value);
            },
            view: (value: any, headers: { [key: string]: string | number; } = {}) => {
                if (value.includes('<') && value.includes('</')) {
                    return res.send(value);
                }
                return res.render(value);
            },
            redirect: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.redirect(value);
            },
            status: (value: number) => {
                res.status(value);
                return this;
            },
        };
    }

    getUri(): string {
        return this._uri;
    }
    getMethod(): Method {
        return this._method;
    }

    public static addRoute(uri: string, action: ActionType, method: Method): Route {
        const instance = new Route();
        instance._uri = '/' + uri.replace(/\/+$/g, '');
        instance._action = action;
        instance._method = method;
        Router.instance._routes.push(instance);

        return instance;
    }

    public static get(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static get(uri: string, action: (arg: any) => any): Route;
    public static get(uri: string, action: (string | typeof BaseController)[]): Route;
    public static get(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.get);
        return instance;
    }

    public static post(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static post(uri: string, action: (arg: any) => any): Route;
    public static post(uri: string, action: (string | typeof BaseController)[]): Route;
    public static post(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.post);
        return instance;
    }

    public static put(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static put(uri: string, action: (arg: any) => any): Route;
    public static put(uri: string, action: (string | typeof BaseController)[]): Route;
    public static put(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.put);
        return instance;
    }

    public static patch(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static patch(uri: string, action: (arg: any) => any): Route;
    public static patch(uri: string, action: (string | typeof BaseController)[]): Route;
    public static patch(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.patch);
        return instance;
    }

    public static delete(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static delete(uri: string, action: (arg: any) => any): Route;
    public static delete(uri: string, action: (string | typeof BaseController)[]): Route;
    public static delete(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.delete);
        return instance;
    }

    public static options(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static options(uri: string, action: (arg: any) => any): Route;
    public static options(uri: string, action: (string | typeof BaseController)[]): Route;
    public static options(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.options);
        return instance;
    }

    public static any(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static any(uri: string, action: (arg: any) => any): Route;
    public static any(uri: string, action: (string | typeof BaseController)[]): Route;
    public static any(uri: string, action: any): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.all);
        return instance;
    }

    public name(name: string): this {
        this._name = name;

        return this;
    }

    public where(arg0: string, arg1: string): this {
        this._where.push(arg0);
        this._where.push(arg1);

        return this;
    }

    middlewareGroup(name: any, middleware: any) { }
    auth(options = []) { }
    view(uri: string, view: any, data = [], status = 200, headers = []) { }
    resource(name: any, controller: any, options = []) { }
    redirect(uri: string, destination: any, status = 302) { }

}

export default Route;
