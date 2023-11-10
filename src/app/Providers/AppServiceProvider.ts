
import ServiceProvider from '@framework/Providers/ServiceProvider';

class AppServiceProvider extends ServiceProvider {

    constructor() {
        super();
    }

    public register(): void {
        // console.log('AppServiceProvider registered');
        super.register();
    }

    public boot(): void {
        // console.log('AppServiceProvider booted');
        super.boot();
    }
}

export default AppServiceProvider;