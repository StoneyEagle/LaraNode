import type { PlaylistsResponse } from "@/types/api/music/playlists";
import { Controller } from "../Controller";
import type { DisplayList } from "@/types/api/music/musicPlayer";

export default class PlaylistController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<PlaylistsResponse>(`${__filename} index`);
    }

    public show(id: string) {
        // @ts-ignore
        return json<DisplayList>(`${__filename} show ${id}`);
    }

    public store(id: string) {
        return json(`${__filename} store ${id}`);
    }

    public update(id: string) {
        return json(`${__filename} update ${id}`);
    }

    public destroy(id: string) {
        return json(`${__filename} destroy ${id}`);
    }

    public like(id: string) {
        return json(`${__filename} like ${id}`);
    }

}