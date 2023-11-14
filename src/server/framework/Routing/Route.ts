import Router from '@framework/Routing/Router';
import BaseController from '@framework/Routing/Controller';
import { NextFunction, Request, Response } from 'express';
import { Method, MethodEnum } from '@framework/Server/Express';
import { Worker } from 'worker_threads';

type MyResponse = {
    json: (value: string|Object, headers?: Headers) => void | Response | Response<unknown, Record<string, unknown>>;
    send: (value: string, headers?: Headers) => void | Response | Response<unknown, Record<string, unknown>>;
    view: (value: string, headers?: Headers) => void | Response | Response<unknown, Record<string, unknown>>;
    redirect: (value: string, headers?: Headers) => void | Response | Response<unknown, Record<string, unknown>>;
    status: (value: number) => typeof Route;
};

type ActionType = string 
    | typeof BaseController 
    | (({ req, res, next, response }: { req: Request, res: Response, next: NextFunction, response: MyResponse; }) => Response)
    | ((arg: unknown) => Route)

type Action = {
    req: Request,
    res: Response,
    next: NextFunction,
    response: MyResponse;
};

type SendResonse = 
    | { type: 'json'|'send'; data: string|Object; headers?: Headers; }
    | { type: 'view'|'redirect'; data: string; headers?: Headers; }
    | { type: 'status'; data: number; headers?: Headers; }

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

    sendResponse(res: Response, response: SendResonse){

        if(!response) return res.sendStatus(404);
        
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

    runClass(controller: string, action: string): Promise<SendResonse> {
        return new Promise((resolve, reject) => {
            try {

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
                    const exec = new (require(controller));
                    try {
                        return resolve(exec[action]());
                    } catch (error) {
                        console.log(exec, action);
                    }
                });
                
            } catch (error) {
                const exec = new (require(controller));                       
                return resolve(exec[action]());
            }
        });
    }
    
    runCallback(callback: () => SendResonse): Promise<SendResonse> {
        return new Promise((resolve, reject) => {
            try {
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
                    return resolve(callback());
                });
                
            } catch (error) {
                return resolve(callback());
            }
        });
    }


    public static response(res: Response): MyResponse {
        return {
            json: (value: Object|String, headers?: Headers) => {
                return res.header(headers).json(value);
            },
            send: (value: string, headers?: Headers) => {
                return res.header(headers).send(value);
            },
            view: (value: string, headers?: Headers) => {
                if (value.includes('<') && value.includes('</')) {
                    return res.header(headers).send(value);
                }
                return res.header(headers).render(value);
            },
            redirect: (value: string, headers?: Headers) => {
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
    
    getName() {
        return this._name;
    }

    public static addRoute(uri: string, action: ActionType | unknown, method: Method): Route {
        const instance = new Route();
        instance._uri = '/' + uri.replace(/\/+$/g, '');
        instance._action = action as ActionType;
        instance._method = method;
        Router.instance._routes.push(instance);

        return instance;
    }

    public static get(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static get(uri: string, action: (arg: unknown) => unknown): Route;
    public static get(uri: string, action: (string | typeof BaseController)[]): Route;
    public static get(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.get);
        return instance;
    }

    public static post(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static post(uri: string, action: (arg: unknown) => unknown): Route;
    public static post(uri: string, action: (string | typeof BaseController)[]): Route;
    public static post(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.post);
        return instance;
    }

    public static put(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static put(uri: string, action: (arg: unknown) => unknown): Route;
    public static put(uri: string, action: (string | typeof BaseController)[]): Route;
    public static put(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.put);
        return instance;
    }

    public static patch(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static patch(uri: string, action: (arg: unknown) => unknown): Route;
    public static patch(uri: string, action: (string | typeof BaseController)[]): Route;
    public static patch(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.patch);
        return instance;
    }

    public static delete(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static delete(uri: string, action: (arg: unknown) => unknown): Route;
    public static delete(uri: string, action: (string | typeof BaseController)[]): Route;
    public static delete(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.delete);
        return instance;
    }

    public static options(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static options(uri: string, action: (arg: unknown) => unknown): Route;
    public static options(uri: string, action: (string | typeof BaseController)[]): Route;
    public static options(uri: string, action: ActionType | unknown): Route {
        const instance = Route.addRoute(uri, action, MethodEnum.options);
        return instance;
    }

    public static any(uri: string, action: ({ req, res, next, response }: Action) => Response): Route;
    public static any(uri: string, action: (arg: unknown) => unknown): Route;
    public static any(uri: string, action: (string | typeof BaseController)[]): Route;
    public static any(uri: string, action: ActionType | unknown): Route {
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

    middlewareGroup(name: unknown, middleware: unknown) { }
    auth(options = []) { }
    view(uri: string, view: unknown, data = [], status = 200, headers = []) { }
    resource(name: unknown, controller: unknown, options = []) { }
    redirect(uri: string, destination: unknown, status = 302) { }

}

export default Route;
