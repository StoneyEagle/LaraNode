
class ServiceProvider {
    public static class: string = this.getFilePath();
    providers: string[] = [];
    
    constructor() {
        // this.register();
        // this.boot();
    }

    public register(): void {
        console.log('Provider registered');
    }

    public boot(): void {
        console.log('Provider booted');
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