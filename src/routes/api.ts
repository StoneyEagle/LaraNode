import UserController from "@/app/Http/Controllers/UserController";
import Route from "@framework/Routing/Route";

Route.get('/', function ({ response }) {
    return response.view('<h1>Hello Api</h1>');
});

Route.get('/about', [UserController.class, 'about']);
