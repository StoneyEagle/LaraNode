import { LibrariesResponse } from "@/types/api/base/library";
import { Controller } from "../Controller";

export default class LibraryController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<LibrariesResponse>(`${__filename} index`);
    }

    public fonts() {
        return json(`${__filename} fonts`);
    }

    public search() {
        return json(`${__filename} search`);
    }

    public favorites() {
        return json(`${__filename} favorites`);
    }

    public available() {
        return json(`${__filename} available`);
    }

    public screensaver() {
        return json(`${__filename} screensaver`);
    }

    public encodeandcast() {
        return json(`${__filename} encodeandcast`);
    }

}