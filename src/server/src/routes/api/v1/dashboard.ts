import UserController from "@/app/Http/Controllers/Dashboard/UserController";
import ResourceController from "@/app/Http/Controllers/General/ResourceController";
import SpecialsController from "@/app/Http/Controllers/Dashboard/SpecialsController";
import LibraryController from "@/app/Http/Controllers/Dashboard/LibraryController";
import Route from "@framework/Routing/Route";
import ConfigurationController from "@/app/Http/Controllers/Dashboard/ConfigurationController";
import ActivityController from "@/app/Http/Controllers/Dashboard/ActivityController";
import TaskController from "@/app/Http/Controllers/Dashboard/TaskController";
import ServerController from "@/app/Http/Controllers/Dashboard/ServerController";
import LogsController from "@/app/Http/Controllers/Dashboard/LogsController";

Route.get('/', function () {
    return send('<h1>Hello Dashboard</h1>');
});

Route.post('/general/languages', [ResourceController.class, 'languages']);
Route.post('/general/countries', [ResourceController.class, 'countries']);

Route.group({
    prefix: 'manage',
}, function () {
	Route.get('/permissions', [UserController.class, 'permissions']);

	Route.get('/users/', [UserController.class, 'index']);
	Route.get('/users/:id', [UserController.class, 'show']).name('users.show');
	Route.put('/users/:id', [UserController.class, 'update']).name('users.update');
	Route.post('/users/', [UserController.class, 'store']).name('users.store');
	Route.patch('/users/:id', [UserController.class, 'update']).name('users.update');
	Route.delete('/users/:id', [UserController.class, 'destroy']).name('users.destroy');

	Route.post('/users/permissions', [UserController.class, 'index']);
	Route.patch('/users/permissions', [UserController.class, 'index']);
	Route.post('/users/notificationsettings', [UserController.class, 'notificationSettings']);
	
	Route.get('/encoderprofiles', [UserController.class, 'index']);
	Route.post('/encoderprofiles', [UserController.class, 'index']);
	Route.patch('/encoderprofiles', [UserController.class, 'index']);
	
	Route.get('/configuration', [ConfigurationController.class, 'index']);
	Route.post('/configuration', [ConfigurationController.class, 'store']);
	Route.patch('/configuration', [ConfigurationController.class, 'update']);

	Route.get('/serverinfo', [ConfigurationController.class, 'serverinfo']);
	Route.get('/serverpaths', [ConfigurationController.class, 'serverpaths']);

	Route.get('/serveractivity', [ActivityController.class, 'index']);
	Route.post('/serveractivity', [ActivityController.class, 'create']);
	Route.delete('/serveractivity', [ActivityController.class, 'destroy']);

	Route.post('/devices', [ActivityController.class, 'index']);
	Route.post('/devices/delete', [ActivityController.class, 'index']);

	Route.post('/server/start', [ServerController.class, 'index']);
	Route.post('/server/stop', [ServerController.class, 'index']);

	Route.post('/logs', [LogsController.class, 'index']);
	Route.post('/logs/delete', [LogsController.class, 'index']);
	Route.post('/logs/options', [LogsController.class, 'index']);

	Route.post('/encode/:id', [UserController.class, 'index']);
	Route.post('/addFiles', [UserController.class, 'index']);
	Route.post('/directorytree', [UserController.class, 'index']);
	Route.post('/fileList', [UserController.class, 'index']);
	Route.post('/metadata', [UserController.class, 'index']);

	Route.get('/specials/', [SpecialsController.class, 'index']);
	Route.post('/specials/', [SpecialsController.class, 'store']);
	Route.patch('/specials/', [SpecialsController.class, 'update']);
	Route.get('/specials/:id', [SpecialsController.class, 'show']);
	Route.get('/specials/search', [SpecialsController.class, 'search']);
	
	Route.get('/libraries/', [LibraryController.class, 'index']);
	Route.patch('/libraries/', [LibraryController.class, 'update']);
	Route.post('/libraries/', [LibraryController.class, 'create']);
	Route.get('/libraries/:id/rescan', [LibraryController.class, 'rescan']);
	Route.delete('/libraries/:id', [LibraryController.class, 'destroy']);
	Route.get('/libraries/:id', [LibraryController.class, 'show']);

	Route.get('/tasks/', [TaskController.class, 'index']);
	Route.delete('/tasks/', [TaskController.class, 'destroy']);
	Route.post('/tasks/pause', [TaskController.class, 'index']);
	Route.post('/tasks/resume', [TaskController.class, 'index']);
	Route.post('/tasks/runners', [TaskController.class, 'index']);
	Route.post('/tasks/queue', [TaskController.class, 'index']);
});