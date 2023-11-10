import UserController from "@/app/Http/Controllers/UserController";
import Route from "@framework/Routing/Route";

Route.get('/', function () {
    return view('<h1>Hello V1</h1>');
});

Route.get('/about', [UserController.class, 'about']);

Route.group({
    prefix: 'users',
    middleware: ['auth'],
}, function () {
    Route.get('/', [UserController.class, 'index']);
    Route.get('/:id', [UserController.class, 'show']).name('users.show');
    Route.put('/:id', [UserController.class, 'update']).name('users.update');
    Route.post('/', [UserController.class, 'store']).name('users.store');
    Route.patch('/:id', [UserController.class, 'update']).name('users.update');
    Route.delete('/:id', [UserController.class, 'destroy']).name('users.destroy');
});