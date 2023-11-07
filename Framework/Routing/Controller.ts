import { MyResponse } from "./Router";

class Controller {
    public constructor() {
    }
    
    public index(): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
    public create(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
    public store(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
    public show(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
    public update(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
    public destroy(id: string): Pick<MyResponse, keyof MyResponse['redirect']> | void
    {
    }
};

export default Controller;