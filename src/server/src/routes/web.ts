import ServerController from "@/app/Http/Controllers/ServerController";
import Route from "@framework/Routing/Route";

Route.get('/', function() {
    return redirect('https://vue-dev.nomercy.tv');
});

Route.get('/routes', [ServerController.class, 'routes']);
Route.get('/status', [ServerController.class, 'status']);

