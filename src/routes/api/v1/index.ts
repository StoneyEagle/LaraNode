import UserController from "@/app/Http/Controllers/UserController";
import Route from "@framework/Routing/Route";

Route.get('/', function ({ response }) {
    return response.view('<h1>Hello V1</h1>');
});

Route.get('/about', [UserController.class, 'about']);

Route.group({
    prefix: 'users',
    middleware: ['auth'],
}, function () {
    Route.get('/', [UserController.class, 'index']);
    Route.post('/', [UserController.class, 'store']).name('users.store');
    Route.get('/:id', [UserController.class, 'show']).name('users.show');
    Route.delete('/:id', [UserController.class, 'destroy']).name('users.destroy');
    Route.put('/:id', [UserController.class, 'update']).name('users.update');
    Route.patch('/:id', [UserController.class, 'update']).name('users.update');
});