import { Controller } from "../Controller";

export default class ServerController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }
}