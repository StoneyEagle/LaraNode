import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
};