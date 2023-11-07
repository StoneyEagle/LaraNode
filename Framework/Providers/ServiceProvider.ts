
class ServiceProvider {
    public constructor() {
        // this.register();
        // this.boot();
    }

    public register(): void {
        console.log('Provider registered');
    }

    public boot(): void {
        console.log('Provider booted');
    }
}

export default ServiceProvider;