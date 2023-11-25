
import ServiceProvider from '@framework/Providers/RouteServiceProvider';
import Router from '@framework/Routing/Router';
import Socket from '@framework/Server/Socket';
import Express from '@framework/Server/Express';
import { allowedOrigins } from '../Http/Middleware/Cors';
import colors from 'cli-color';
import { deviceId } from '../Helper/system';

class RouteServiceProvider extends ServiceProvider {
    public express: Express = <Express>{};

    constructor() {
        super();
    }

    public static HOME = '/';

    public async register(): Promise<void> {
        super.register();

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
    }

    public async boot(): Promise<void> {

        return new Promise((resolve, reject) => {

            this.express.startServer()
                .then(() => {

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
                });
            resolve();
        });
    }

    public running(secure: boolean = true) {

        const g = colors.bgBlack.green;
        const gb = colors.bgBlack.greenBright;
        const cc = colors.bgBlack.blackBright;
        const c3 = colors.bgBlack.bold.white;
        const link = colors.bgBlack.bold.underline.white;

        console.log(
            g(`╔══════════════════════════════════════════════╗\n`)
            + g(`║ ${secure ? ' ' : ''}   ` + gb(`${secure ? 'Secure' : 'Unsecure'} server running: on port: ` + c3(`${serverPort()}`.replace(', ', '') + g(` ${secure ? ' ' : ''}   ║\n`))))
            + g(`║  ${secure ? ' ' : ''}  ` + cc(`visit: ` + link(`https://app-dev.nomercy.tv`) + g(`     ${secure ? '' : ' '}   ║\n`))
                + g(`╚══════════════════════════════════════════════╝`))
        );

        if (secure) {
            process.env.INTERNAL_DOMAIN = `https://${globalThis.internalIp.replace(/\./g, '-')}.${deviceId}.nomercy.tv:${serverPort()}`;
            process.env.EXTERNAL_DOMAIN = `https://${globalThis.externalIp.replace(/\./g, '-')}.${deviceId}.nomercy.tv:${serverPort()}`;
            console.log(`Internal address: ${link(process.env.INTERNAL_DOMAIN)}`);
            console.log(`External address: ${link(process.env.EXTERNAL_DOMAIN)}`);
        } else {
            process.env.INTERNAL_DOMAIN = `http://${globalThis.internalIp}:${serverPort()}`;
            console.log(`Internal address: ${link(process.env.INTERNAL_DOMAIN)}`);
        }
    }
}

export default RouteServiceProvider;


