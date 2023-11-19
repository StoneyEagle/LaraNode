import type { InfoResponse } from "@/types/api/base/info";
import { Controller } from "../Controller";

export default class TvController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<InfoResponse>(`${__filename} index`);
    }

    public available() {
        // @ts-ignore
        return json<{ available: boolean; }>(`${__filename} available`);
    }

    public watch() {
        return json(`${__filename} watch`);
    }
}