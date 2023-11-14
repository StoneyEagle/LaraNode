import { PersonResponse } from "@/types/api/base/person";
import { Controller } from "../Controller";

export default class SpecialController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<PersonResponse>(`${__filename} index`);
    }
}