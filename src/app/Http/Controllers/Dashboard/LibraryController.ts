import { Controller } from "../Controller";

export default class LibraryController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }

    public rescan() {
        return json(`${__filename} rescan`);
    }
}