
import ServiceProvider from '@framework/Providers/AuthServiceProvider';

class AuthServiceProvider extends ServiceProvider {

    constructor() {
        super();
    }

    public register(): void {
        // console.log('AuthServiceProvider registered');
        super.register();
    }

    public boot(): void {
        // console.log('AuthServiceProvider booted');
        super.boot();
    }
}

export default AuthServiceProvider;