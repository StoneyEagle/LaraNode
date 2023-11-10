
import ServiceProvider from '@framework/Providers/LanguageServiceProvider';

class LanguageServiceProvider extends ServiceProvider {
    constructor() {
        super();
    }

    public register(): void {
        // console.log('LanguageServiceProvider registered');
        super.register();
    }

    public boot(): void {
        // console.log('LanguageServiceProvider booted');
        super.boot();
    }
}

export default LanguageServiceProvider;