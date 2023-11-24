
import ServiceProvider from '@framework/Providers/RouteServiceProvider';
import Router from '@framework/Routing/Router';
import Socket from '@framework/Server/Socket';
import Express from '@framework/Server/Express';
import { allowedOrigins } from '../Http/Middleware/Cors';

class RouteServiceProvider extends ServiceProvider {
    public express: Express = <Express>{};

    constructor() {
        super();
    }

    public static HOME = '/';

    public register(): void {
        super.register();
    }

    public boot(): this {
        this.express = this.registerRoutes(function () {

            Router.middleware('web')
                .group(base_path('routes/web'));

            Router.middleware('api')
                .prefix('/api')
                .group(base_path('routes/api'));

            Router.middleware(['api'])
                .prefix('api/v1')
                .group(base_path('routes/api/v1/index'));

            Router.middleware('web')
                .prefix('/api/v1/dashboard')
                .group(base_path('routes/api/v1/dashboard'));
                
            Router.middleware('web')
                .prefix('/api/v1/music')
                .group(base_path('routes/api/v1/music'));
        });

        const io = Socket.make();
        io.makeServer(this.express.server, {
            allowEIO3: true,
            path: '/socket',
            cors: {
                // origin: '*',
                origin: allowedOrigins,
                credentials: true,
                maxAge: 1000 * 60 * 60 * 30,
                optionsSuccessStatus: 200,
            },            
        });

        // this.express.testRoutes();
        // this.express.showRoutes();      
        
        return this;
    }
}

export default RouteServiceProvider;


