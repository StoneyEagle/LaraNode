import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    
    res.header('X-Powered-By', 'NoMercy MediaServer');
    res.header('Access-Control-Allow-Private-Network', 'true');

    return next();
};