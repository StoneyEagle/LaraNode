import { allowedOrigins } from '@/app/Http/Middleware/Cors';
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    const origins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS?.split(',') 
        : allowed;

    if (origins.some(o => o == req.headers.origin) || origins.some(o => o == '*')) {
        res.set('Access-Control-Allow-Origin', req.headers.origin ?? req.headers.host);
    }

    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
};

const allowed = allowedOrigins ?? [
    '*', // Allow all origins
];