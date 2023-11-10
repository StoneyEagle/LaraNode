import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";
import AuthServiceProvider from "@framework/Providers/AuthServiceProvider";
import LanguageServiceProvider from "@framework/Providers/LanguageServiceProvider";

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
    AuthServiceProvider = <AuthServiceProvider>{};
    LanguageServiceProvider = <LanguageServiceProvider>{};
    RouteServiceProvider = <RouteServiceProvider>{};


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
// 
        (config('app.providers') as unknown as string[]).forEach((provider) => {
            const Class = require(provider).default;
            const instance = new Class();

            instance.register();
            instance.boot();

            this[Class.name] = instance;
        });

        const app = this.RouteServiceProvider.express.app;

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