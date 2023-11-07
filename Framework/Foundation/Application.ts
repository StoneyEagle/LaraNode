import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";

class Application {
    instance: any;

    make() {

        if (this.instance) {
            throw new Error('Application instance already exists');
        }

        this.instance = new _Application();
        return this.instance;
    }
}

class _Application {

    router: RouteServiceProvider = new RouteServiceProvider();

    public constructor() {
        // console.log(base_path());
        // console.log(app_path());
        // console.log(config_path());
        // console.log(database_path());
        // console.log(public_path());
        // console.log(resource_path());
        // console.log(route_path());
        // console.log(storage_path());
        // console.log(view_path());

        // console.log(config('apiKeys'));
        // console.log(config('apiKeys.TMDB_API_KEY'));

        this.init_router();
    }

    init_router() {
        this.router.register();
        this.router.boot();

        return this;
    }

    send() {
        return this;
    }

    handle(arg0: any) {
        return this;
    }

    terminate($request: any, $response: any) {
        return this;
    }
}

export default Application;