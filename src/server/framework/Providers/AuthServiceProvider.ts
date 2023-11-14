import ServiceProvider from "./ServiceProvider";

class AuthServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    constructor() {
        super();
    }

    public register(): void {
        // console.log('AuthServiceProvider registered');
    }

    public boot(): void {
        // console.log('AuthServiceProvider booted');
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

export default AuthServiceProvider;