import { Controller } from '@/app/Http/Controllers/Controller';
import {
    AppPath, BasePath,
    Config, ConfigPath,
    DatabasePath, Env,
    PublicPath, ResourcePath,
    RoutePath, StoragePath,
    ViewPath
} from '@framework/Foundation/Helpers';
import { MyResponse } from '@framework/Routing/Router';
import { NextFunction, Request, Response } from 'express';

declare global {
    var base_path: BasePath;
    var app_path: AppPath;
    var config_path: ConfigPath;
    var database_path: DatabasePath;
    var public_path: PublicPath;
    var resource_path: ResourcePath;
    var storage_path: StoragePath;
    var route_path: RoutePath;
    var view_path: ViewPath;
    var env: Env;
    var config: Config;
    var routes: (arg0: () => void) => void;
}

declare class extends Controller {
    constructor(req: Request, res: Response, next: NextFunction);
    index(): Pick<MyResponse, keyof MyResponse['redirect']> | void;
    create(): Pick<MyResponse, keyof MyResponse['redirect']> | void;
    store(): Pick<MyResponse, keyof MyResponse['redirect']> | void;
    show(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void;
    update(): Pick<MyResponse, keyof MyResponse['redirect']> | void;
    destroy(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void;
}

export { };

    import { Express } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request extends Express.Request {
    language: string;
    country: string;

    user: KC;
	  access_token: string;

    isOwner: boolean;
    isModerator: boolean
    isAllowed: boolean;
    id: string;
    
  }
}
