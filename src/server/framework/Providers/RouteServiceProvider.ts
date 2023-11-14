import ServiceProvider from "./ServiceProvider";
import Express from "../Server/Express";
import Router from "@framework/Routing/Router";

class RouteServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    protected express: Express = <Express>{};

    public constructor() {
        super();
    }

    public static HOME = '/';

    public register(): void {
        // console.log('RouteServiceProvider registered');
    }

    public boot(): void {
        // console.log('RouteServiceProvider booted');
        this.registerRoutes(function () { });
    }

    registerRoutes(arg0: () => void): Express {
        arg0();

        this.express = new Express();

        this.express.make_HttpServer();
        this.express.addRoutes(Router.routerList());
        this.express.startServer();  

        return this.express;
    }

    protected static getFilePath(): string {
        const nodeModule = this.getNodeModule();
        return (nodeModule) ? nodeModule.filename : "";
    }

    protected static getNodeModule(): NodeModule | undefined {
        const nodeModule = Object.values(require.cache)
            .filter((mn) => mn?.filename.includes(this.name))
            .shift();
        return nodeModule;
    }

}

export default RouteServiceProvider;
