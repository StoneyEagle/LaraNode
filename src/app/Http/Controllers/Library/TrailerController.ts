import { Controller } from "../Controller";

export default class SpecialController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }
}