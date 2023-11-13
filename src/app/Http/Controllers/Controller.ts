import BaseController from '@framework/Routing/Controller';
import Route from '@framework/Routing/Route';
import { NextFunction, Request, Response } from 'express';

export class Controller extends BaseController {
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

    view(data, headers?: Headers) {
        return Route.response(this.res).view(data, headers);
    }

    protected static getFilePath(): string {
        const nodeModule = this.getNodeModule();
        return (nodeModule) ? nodeModule.filename : "";
    }

    protected static getNodeModule(): NodeModule | undefined {
        const nodeModule = Object.values(require.cache)
            .filter((chl) => chl?.children.includes(module))
            .filter((mn) => mn?.filename.includes(this.name))
            .shift();
        return nodeModule;
    }

    
    /**
     * Display a listing of the resource.
     */
    public index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public store(id: string)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public show(id: string)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public update(id: string)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public destroy(id: string)
    {
        //
    }
    
}