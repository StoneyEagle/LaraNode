import { Controller } from "../Controller";

export default class TaskController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }
}