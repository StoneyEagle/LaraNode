
import ServiceProvider from '@framework/Providers/ServiceProvider';
import Setup from '../Utils/Setup';

class AppServiceProvider extends ServiceProvider {
    public static class: string = `${this.getFilePath()}`;

    constructor() {
        super();
    }

    public async register(): Promise<void> {
        await super.register();
        await this.setup();
    }

    public async boot(): Promise<void> {
        await super.boot();
    }

    private async setup() {
        const setup = new Setup();
        await setup.init();
    }
}

export default AppServiceProvider;