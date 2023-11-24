
import ServiceProvider from '@framework/Providers/ElectronServiceProvider';

class ElectronServiceProvider extends ServiceProvider {
    constructor() {
        super();
        this.open = false;
    }

    public register(): void {
        super.register();
    }

    public boot(): void {
        super.boot();
    }
}

export default ElectronServiceProvider;