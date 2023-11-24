import Logger from "@framework/Foundation/Logger";

class ServiceProvider {
    public static class: string = `${this.getFilePath()}`;
    providers: string[] = [];

    public register(): void {
        process
            .on('unhandledRejection', (reason: Object, p) => {
                if(Object.values(reason)[1] == 'ERR_ABORTED' || Object.values(reason).includes('cert')) {
                    return;
                }
                console.log(reason);
                Logger.error({
                    level: 'error',
                    name: 'unhandledRejection',
                    color: 'red',
                    message: reason,
                });
            })
            .on('uncaughtException', (err) => {
                Logger.error({
                    level: 'error',
                    name: 'uncaughtException',
                    color: 'red',
                    message: err,
                });
            });
    
        // console.log('Provider registered');
    }

    public boot(): void {
        // console.log('Provider booted');
    }

    static defaultProviders() {
        const instance = new ServiceProvider();

        instance.register();
        instance.boot();

        return instance;
    }

    merge(arg0: string[]) {
        this.providers.push(...arg0);

        return this.providers;
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

export default ServiceProvider;