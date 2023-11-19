
import ServiceProvider from '@framework/Providers/ElectronServiceProvider';

class ElectronServiceProvider extends ServiceProvider {
    constructor() {
        super();
        this.open = false;
    }

    public register(): void {
        console.log('ElectronServiceProvider registered');
        super.register();
    }

    public boot(): void {
        console.log('ElectronServiceProvider booted');
        super.boot();
    }
}

export default ElectronServiceProvider;