import { ArtistResponse } from "@/types/api/music/artist";
import { Controller } from "../Controller";

export default class ArtistController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<MusicCardPageResponse>(`${__filename} index`);
    }

    public show(id: string) {
        // @ts-ignore
        return json<ArtistResponse>(`${__filename} index`);
    }
    
    public like(id: string) {
        return json(`${__filename} like ${id}`);
    }
}