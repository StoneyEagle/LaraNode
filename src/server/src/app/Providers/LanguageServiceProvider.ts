
import ServiceProvider from '@framework/Providers/LanguageServiceProvider';

class LanguageServiceProvider extends ServiceProvider {
    constructor() {
        super();
    }

    public async register(): Promise<void> {
        await super.register();
    }

    public async boot(): Promise<void> {
        await super.boot();
    }
}

export default LanguageServiceProvider;