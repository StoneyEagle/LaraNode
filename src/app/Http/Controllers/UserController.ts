import { Controller } from "./Controller";

export default class UserController extends Controller {

    public about() {
        return this.view('<h1>ABOOT</h1>');
    }

    /**
     * Display a listing of the resource.
     */
    public index()
    {
        
        return this.view('<h1>Hello FillyBilly vliegtuigggg</h1>', {
            'Content-Type': 'application/json',
            'X-Powered-By': 'NoMercy Media Server',
            status: 200,
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public store(id: string)
    {
        console.log(this.req.body);
        return this.response().json({id, body: 'Hello Store World'});
    }

    /**
     * Display the specified resource.
     */
    public show(id)
    {
        return this.response().json({id, body: 'Hello Show World'});
    }

    /**
     * Update the specified resource in storage.
     */
    public update(id: string)
    {
        return this.response().json({id, body: 'Hello Update World'});
    }

    /**
     * Remove the specified resource from storage.
     */
    public destroy(id: string)
    {
        // return id;
        // console.log(id);
        return this.response().json({id, body: 'Hello Destroy World'});
    }
    
}
