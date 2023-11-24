import ServiceProvider from "./ServiceProvider";
import Express from "../Server/Express";
import Router from "@framework/Routing/Router";
import { sslCA, sslCert, sslKey } from "@/app/Helper/paths";
import { resolve } from "path";

class RouteServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    protected express: Express = <Express>{};

    public constructor() {
        super();
    }

    public static HOME = '/';

    public register(): void {
        this.registerRoutes(function () { });
    }

    public boot(): void {
    }

    registerRoutes(arg0: () => void): Express {
        arg0();

        this.express = new Express();
        this.express.running = this.running

        this.express.make_HttpsServer({
			key: resolve(sslKey),
			cert: resolve(sslCert),
			ca: resolve(sslCA),
			allowHTTP1: true,
        });
        this.express.addRoutes(Router.routerList());

        return this.express;
    }

    public running() {}

}

export default RouteServiceProvider;
