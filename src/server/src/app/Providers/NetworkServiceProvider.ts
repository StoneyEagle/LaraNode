import ServiceProvider from '@framework/Providers/NetworkServiceProvider';

class NetworkServiceProvider extends ServiceProvider {

    constructor() {
        super();
    }

    public register(): void {
        super.register();
    }

    public boot(): void {
        super.boot();
    }
}

export default NetworkServiceProvider;