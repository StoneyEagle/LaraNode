import { Controller } from "./Controller";

export default class ServerController extends Controller {
    public static class: string = __filename;

    public restart() {
        const status = app.restart();
        return json({
            status: 'alive',
            version: status,
        });
    }

    public status() {
        return app.status();
    }

    public routes() {
        return json(app.RouteServiceProvider.express.listRoutes());
    }
}
