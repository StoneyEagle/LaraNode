import { Controller } from "../Controller";

export default class SpecialsController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }

    public search() {
        return json(`${__filename} search`);
    }
}