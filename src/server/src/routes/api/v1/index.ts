import LibraryController from "@/app/Http/Controllers/Library/LibraryController";
import TvController from "@/app/Http/Controllers/Library/TvController";
import MovieController from "@/app/Http/Controllers/Library/MovieController";
import SpecialController from "@/app/Http/Controllers/Library/SpecialController";
import CollectionController from "@/app/Http/Controllers/Library/CollectionController";
import PersonController from "@/app/Http/Controllers/Library/PersonController";
import TrailerController from "@/app/Http/Controllers/Library/TrailerController";
import Route from "@framework/Routing/Route";

Route.get('/', [LibraryController.class, 'index']);

Route.get('/movie/:id', [MovieController.class, 'show']);
Route.get('/movie/:id/watch', [MovieController.class, 'watch']);
Route.get('/movie/:id/available', [MovieController.class, 'available']);

Route.get('/tv/:id', [TvController.class, 'show']);
Route.get('/tv/:id/watch', [TvController.class, 'watch']);
Route.get('/tv/:id/available', [TvController.class, 'available']);

Route.get('/collections', [CollectionController.class, 'index']);
Route.get('/collection/:id', [CollectionController.class, 'index']);

Route.get('/specials', [SpecialController.class, 'index']);
Route.get('/special/:id', [SpecialController.class, 'show']);
Route.get('/special/:id/watch', [SpecialController.class, 'watch']);
Route.get('/special/:id/available', [SpecialController.class, 'available']);

Route.get('/libraries', [LibraryController.class, 'index']);
Route.get('/libraries/:id', [LibraryController.class, 'show']);

Route.get('/people', [PersonController.class, 'index']);
Route.get('/person/:id', [PersonController.class, 'show']);

Route.get('/screensaver', [LibraryController.class, 'screensaver']);

Route.get('/fonts', [LibraryController.class, 'fonts']);
Route.get('/search', [LibraryController.class, 'search']);

Route.get('/trailer/:id', [TrailerController.class, 'show']);
Route.delete('/trailer/:id', [TrailerController.class, 'destroy']);

Route.post('/encodeandcast', [LibraryController.class, 'encodeandcast']);

Route.get('/favorites', [LibraryController.class, 'favorites']);