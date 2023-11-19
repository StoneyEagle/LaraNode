import Express from '@framework/Server/Express';
import { Request, Response } from 'express';
import i18next from 'i18next';

export default (req: Request, res: Response) => {
    req.language = Express.getLanguage(req);
    req.country = Express.getCountry(req);

    i18next.changeLanguage(req.language);
};