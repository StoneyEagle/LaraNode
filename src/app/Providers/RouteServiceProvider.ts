
import ServiceProvider from '@framework/Providers/RouteServiceProvider';
import Router from '@framework/Routing/Router';

class RouteServiceProvider extends ServiceProvider {
    public constructor() {
        super();
    }

    public static HOME = '/';

    public register(): void {
    }

    public boot(): void {
        this.routes(function () {

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

    }
}

export default RouteServiceProvider;


