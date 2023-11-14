import { MusicHomeResponse } from "@/types/api/music";
import { Controller } from "../Controller";

export default class MusicController extends Controller {
    public static class: string = __filename;

    public index() {
        return json<MusicHomeResponse[]>([]);
    }
}