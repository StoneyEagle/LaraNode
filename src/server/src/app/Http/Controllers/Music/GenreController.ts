import { GenresResponse } from "@/types/api/music/genres";
import { Controller } from "../Controller";
import { GenreResponse } from "@/types/api/music/genre";

export default class GenreController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<GenresResponse>(`${__filename} index`);
    }

    public show(id: string) {
        // @ts-ignore
        return json<GenreResponse>(`${__filename} show ${id}`);
    }
}