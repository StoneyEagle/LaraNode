import { Controller } from "../Controller";

export default class UserController extends Controller {
    public static class: string = __filename;

    public about() {
        return view('<h1>ABOOT</h1>');
    }

    /**
     * Display a listing of the resource.
     */
    public index() {
        return view('<h1>Hello FillyBilly vliegtuigggg</h1>', {
            'Content-Type': 'application/json',
            'X-Powered-By': 'NoMercy Media Server',
            status: 200,
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public store(id: string) {
        return json(`${__filename} store`);
    }

    /**
     * Display the specified resource.
     */
    public show(id) {
        return json(`${__filename} show ${id}`);
    }

    /**
     * Update the specified resource in storage.
     */
    public update(id: string) {
        return json(`${__filename} update ${id}`);
    }

    /**
     * Remove the specified resource from storage.
     */
    public destroy(id: string) {
        return json(`${__filename} destroy ${id}`);
    }

    public permissions() {
        return json(`${__filename} permissions`);
    }

    public notificationSettings() {
        return json(`${__filename} notificationSettings`);
    }

}
