import ServerController from "@/app/Http/Controllers/ServerController";
import Route from "@framework/Routing/Route";

Route.group({
    prefix: 'server',
}, function () {
    Route.post('/restart', [ServerController.class, 'restart']).middleware('auth');
});
