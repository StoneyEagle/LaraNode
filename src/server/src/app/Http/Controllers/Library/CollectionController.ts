import type { CollectionResponse } from "@/types/api/base/collection";
import { Controller } from "../Controller";

export default class CollectionController extends Controller {
    public static class: string = __filename;

    public index() {
        // @ts-ignore
        return json<CollectionResponse>(`${__filename} index`);
    }
}