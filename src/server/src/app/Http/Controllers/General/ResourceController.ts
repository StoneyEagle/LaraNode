import { Country, Language } from "@/types/api/shared";
import { Controller } from "../Controller";

export default class ResourceController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json(`${__filename} index`);
    }

    public languages() {
        // @ts-ignore
        return json<Language[]>(`${__filename} index`);
    }
    
    public countries() {
        // @ts-ignore
        return json<Country[]>(`${__filename} index`);
    }
}