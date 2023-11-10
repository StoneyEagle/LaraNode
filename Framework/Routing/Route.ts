import Router from '@framework/Routing/Router';
import BaseController from '@framework/Routing/Controller';
import { NextFunction, Request, Response } from 'express';
import { Method, MethodEnum } from '@framework/Server/Express';
import { Worker } from 'worker_threads';

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

    async getCallback(req: Request, res: Response) {
        const controller = this._action[0] ?? this._action;

        if (typeof controller === 'function') {
            const response = await this.runCallback(controller);
            this.sendResponse(res, response);

        } else if (typeof controller === 'string') {
            const action = this._action[1];
            const response = await this.runClass(controller, action);
            this.sendResponse(res, response);
        }
    }

    sendResponse(res: Response, response: { type: string; data: any; headers: any; }){
        
        if (response.type === 'view') {
            if (response.data.includes('<') && response.data.includes('</')) {
                return res.header(response.headers).send(response.data);
            }
            return res.render(response.data);
        } else if (response.type === 'redirect') {
            return res.redirect(response.data);
        } else if (response.type === 'json') {
            return res.json(response.data);
        } else if (response.type === 'send') {
            return res.send(response.data);
        } else if (response.type === 'status') {
            return res.sendStatus(response.data);
        }
    }

    runClass(controller: string, action: string): Promise<{ type: string; data: any; headers: any; }> {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__dirname + '/../Workers/CallbackWorker.ts', {
                workerData: {
                    controller: controller,
                    action: action,
                },
                execArgv: ["--require", "ts-node/register"],
            });
            worker.once('message', (message) => {
                return resolve(message);
            });
            worker.once('error', (error) => {
                return reject(error);
            });
        });
    }
    
    runCallback(callback: () => void): Promise<{ type: string; data: any; headers: any; }> {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__dirname + '/../Workers/CallbackWorker.ts', {
                workerData: {
                    callback: callback.toString(),
                },
                execArgv: ["--require", "ts-node/register"],
            });
            worker.once('message', (message) => {
                return resolve(message);
            });
            worker.once('error', (error) => {
                return reject(error);
            });
        });
    }


    public static response(res: Response): MyResponse {
        return {
            json: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.header(headers).json(value);
            },
            send: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.header(headers).send(value);
            },
            view: (value: any, headers: { [key: string]: string | number; } = {}) => {
                if (value.includes('<') && value.includes('</')) {
                    return res.header(headers).send(value);
                }
                return res.header(headers).render(value);
            },
            redirect: (value: any, headers: { [key: string]: string | number; } = {}) => {
                return res.header(headers).redirect(value);
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
