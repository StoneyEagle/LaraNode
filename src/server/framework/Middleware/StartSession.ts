import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

export default (req: Request, res: Response) => {   
	const token = req.query.token ?? (req.headers.authorization as string)?.split(',')[0]?.split(' ')[1];

    if(!token) return;

    const userinfo = jwtDecode(token as string) as any;

    req.user = userinfo;
    req.access_token = token as string;
};