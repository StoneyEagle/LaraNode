import Route from "@framework/Routing/Route";

import AlbumController from "@/app/Http/Controllers/Music/AlbumController";
import ArtistController from "@/app/Http/Controllers/Music/ArtistController";
import GenreController from "@/app/Http/Controllers/Music/GenreController";
import MusicController from "@/app/Http/Controllers/Music/MusicController";
import PlaylistController from "@/app/Http/Controllers/Music/PlaylistController";
import TrackController from "@/app/Http/Controllers/Music/TrackController";

Route.get('/', [MusicController.class, 'index']);

Route.get('/genres', [GenreController.class, 'index']);
Route.get('/genre/:id', [GenreController.class, 'show']);

Route.get('/collection/albums', [AlbumController.class, 'index']);
Route.group({
    prefix: '/albums'
}, () => {
    Route.get('/albums', [AlbumController.class, 'index']);
    Route.get('/album/:id', [AlbumController.class, 'show']);
    Route.post('/album/:id/like', [AlbumController.class, 'like']);
});

Route.get('/collection/artists', [ArtistController.class, 'index']);
Route.group({
    prefix: '/artist'
}, () => {
    Route.get('/artists', [ArtistController.class, 'index']);
    Route.get('/artist/:id', [ArtistController.class, 'show']);
    Route.post('/artist/:id/like', [ArtistController.class, 'like']);
});

Route.get('/collection/playlists', [PlaylistController.class, 'index']);
Route.group({
    prefix: '/playlist'
}, () => {
    Route.get('/playlists/', [PlaylistController.class, 'index']);
    Route.get('/playlists/:id', [PlaylistController.class, 'show']);
    Route.patch('/playlists/:id', [PlaylistController.class, 'update']);
    Route.post('/playlists/:id', [PlaylistController.class, 'store']);
    Route.delete('/playlists/:id', [PlaylistController.class, 'destroy']);
});

Route.get('/collection/tracks', [TrackController.class, 'index']);
Route.post('/tracks/:id/like', [TrackController.class, 'like']);
Route.get('/lyrics', [TrackController.class, 'lyrics']);
Route.get('/search', [TrackController.class, 'search']);
Route.get('/search/:query/:type', [TrackController.class, 'typeSearch']);
Route.get('/coverimage', [TrackController.class, 'coverImage']);
Route.get('/images', [TrackController.class, 'images']);
