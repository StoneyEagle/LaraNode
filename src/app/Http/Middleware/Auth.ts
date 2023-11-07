import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    console.log('auth middleware');

    req.user = {
        id: 1,
        name: 'test',
        email: '',
    };

    return next();
};