import AppServiceProvider from "@/app/Providers/AppServiceProvider";
import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";
import AuthServiceProvider from "@framework/Providers/AuthServiceProvider";
import ElectronServiceProvider from "@framework/Providers/ElectronServiceProvider";
import LanguageServiceProvider from "@framework/Providers/LanguageServiceProvider";

class Application {
    instance: _Application | undefined;

    boot() {

        if (this.instance) {
            throw new Error('Application instance already exists');
        }

        this.instance = new _Application();
        globalThis.app = this.instance;

        return this.instance;
    }
}

export type App = _Application;

class _Application {
    AppServiceProvider = <AppServiceProvider>{};
    AuthServiceProvider = <AuthServiceProvider>{};
    LanguageServiceProvider = <LanguageServiceProvider>{};
    RouteServiceProvider = <RouteServiceProvider>{};
    ElectronServiceProvider = <ElectronServiceProvider>{};

    public constructor() {
        (config('app.providers') as unknown as string[]).forEach((provider) => {
            const Class = require(provider);
            const instance = new Class();

            instance.register();
            instance.boot();

            this[Class.name] = instance;
        });
    }

    restart() {
        this.terminate();
        const instance = new Application().boot();

        return instance;
    }

    terminate() {
        this.RouteServiceProvider.express.server?.close((err: Error | undefined) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Server closed');

        });
        return this;
    }


    status() {
        return json({
            status: 'alive',
            version: serverVersion(),

        });
    }
}

export default Application;