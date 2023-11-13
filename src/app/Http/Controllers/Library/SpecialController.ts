import { Controller } from "../Controller";

export default class SpecialController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<InfoResponse>(`${__filename} index`);
    }

    public available() {
        // @ts-ignore
        return json<{available: boolean}>(`${__filename} available`);
    }

    public watch() {
        return json(`${__filename} watch`);
    }
}