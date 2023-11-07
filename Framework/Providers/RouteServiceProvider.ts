import ServiceProvider from "./ServiceProvider";
import Express from "../Server/Express";
import Router from "@framework/Routing/Router";

class RouteServiceProvider extends ServiceProvider {

    public constructor() {
        super();
    }

    public static HOME = '/';

    public register(): void {
    }

    public boot(): void {
        this.routes(function () { });
    }

    routes(arg0: () => void) {
        arg0();

        const express = new Express();
        express.make_HttpServer();
        express.addRoutes(Router.routerList());
        express.startServer();

        // console.log(express.app._router.stack.filter((r: any) => r.name == 'router').map((r: any) => r.handle));
        
        // for (const route of express.listRoutes()) {
        //     const url = `http://localhost:${express.port}${route.path}`;

        //     // @ts-ignore
        //     axios[route.method](url).then((response) => {
        //         console.log(`route: ${route.path} is working`);
        //     }).catch((error) => {
        //         console.log(`route: ${route.path} is not working`);
        //     })
        // }
    }

}

export default RouteServiceProvider;