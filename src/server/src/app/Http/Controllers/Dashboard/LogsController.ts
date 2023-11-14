import { Controller } from "../Controller";

export default class LogsController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }
}