import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    res.set('X-Powered-By', serverName());
    res.set('Access-Control-Allow-Private-Network', 'true');
};