import ServiceProvider from "./ServiceProvider";

class AuthServiceProvider extends ServiceProvider {
    public constructor() {
        super();
    }

    public register(): void {
        console.log('AuthServiceProvider registered');
    }

    public boot(): void {
        console.log('AuthServiceProvider booted');
    }
}

export default AuthServiceProvider;