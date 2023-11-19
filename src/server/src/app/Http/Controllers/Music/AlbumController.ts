import type { AlbumResponse } from "@/types/api/music/album";
import { Controller } from "../Controller";
import type { MusicCardPageResponse } from "@/types/api/music/musicPlayer";

export default class AlbumController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<MusicCardPageResponse>(`${__filename} index`);
    }

    public show(id: string) {
        // @ts-ignore
        return json<AlbumResponse>(`${__filename} index`);
    }

    public like(id: string) {
        return json(`${__filename} like ${id}`);
    }
}