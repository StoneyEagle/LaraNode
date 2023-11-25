
import ServiceProvider from '@framework/Providers/ElectronServiceProvider';

class ElectronServiceProvider extends ServiceProvider {

    constructor() {
        super();

        this.title = 'NoMercy Media Server';
        this.tooltip = this.title;
        this.open = false;
    }

    public async register(): Promise<void> {
        await super.register();
    }

    public async boot(): Promise<void> {
        await super.boot();
    }
}

export default ElectronServiceProvider;