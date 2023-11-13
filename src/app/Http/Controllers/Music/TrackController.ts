import { Controller } from "../Controller";

export default class TrackController extends Controller {
    public static class: string = __filename;

    public index() {
        return json(`${__filename} index`);
    }
    
    public like(id: string) {
        return json(`${__filename} like ${id}`);
    }

    public search() {
        return json(`${__filename} search`);        
    }

    public lyrics() {
        return json(`${__filename} lyrics`);        
    }

    public images() {
        return json(`${__filename} images`);        
    }

    public coverImage() {
        return json(`${__filename} coverImage`);        
    }

    public typeSearch() {
        return json(`${__filename} typeSearch`);        
    }
}