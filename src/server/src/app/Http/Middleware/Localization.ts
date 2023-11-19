import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    res.set('Content-Language', req.language);
};