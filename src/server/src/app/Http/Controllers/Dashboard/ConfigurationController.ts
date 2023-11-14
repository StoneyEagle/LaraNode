import { Controller } from "../Controller";

export default class ConfigurationController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }

    public serverpaths() {
        return json(`${__filename} serverpaths`);
    }

    public serverinfo() {
        return json(`${__filename} serverinfo`);
    }
}