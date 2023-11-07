import BaseController from '@framework/Routing/Controller';
import Route from '@framework/Routing/Route';
import { NextFunction, Request, Response } from 'express';

export class Controller extends BaseController {
    public static class: string = this.getFilePath();
    req: Request;
    res: Response;
    next: NextFunction;

    constructor(req: Request, res: Response, next: NextFunction) {
        super();

        this.req = req;
        this.res = res;
        this.next = next;
    }

    response() {
        return Route.response(this.res);
    }

    view(data, headers = {}) {
        return Route.response(this.res).view(data, headers);
    }

    private static getFilePath(): string {
        const nodeModule = this.getNodeModule();
        return (nodeModule) ? nodeModule.filename : "";
    }

    private static getNodeModule(): NodeModule | undefined {
        const nodeModule = Object.values(require.cache)
            .filter((chl) => chl?.children.includes(module))
            .filter((mn) => mn?.filename.includes(this.name))
            .shift();
        return nodeModule;
    }
    
}