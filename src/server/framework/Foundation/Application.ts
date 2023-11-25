import AppServiceProvider from "@/app/Providers/AppServiceProvider";
import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";
import AuthServiceProvider from "@framework/Providers/AuthServiceProvider";
import ElectronServiceProvider from "@framework/Providers/ElectronServiceProvider";
import LanguageServiceProvider from "@framework/Providers/LanguageServiceProvider";
import colors from "cli-color";

class Application {
    instance: _Application | undefined;

    boot() {

        if (this.instance) {
            throw new Error('Application instance already exists');
        }

        process.stdout.write(colors.reset);

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
        const providers = config('app.providers') as unknown as string[];

        new Promise(async (resolve) => {

            for (const provider of providers) {

                const Class = require(provider);
                const instance = new Class();

                await instance.register();

                this[Class.name] = instance;
            }

            setTimeout(async () => {
                for (const provider of providers) {
                    const Class = require(provider);
                    await this[Class.name].boot();
                };
                resolve(true);
            }, 1000);
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