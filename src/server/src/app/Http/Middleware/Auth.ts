import { owner } from '@/app/Helper/paths';
import Logger from '@framework/Foundation/Logger';
import { Request, Response } from 'express';

const allowedUsers = [];
globalThis.allowedUsers = allowedUsers;

export default (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}

	req.isOwner = isOwner(req);
	req.isModerator = isModerator(req);
	req.isAllowed = isAllowed(req);

};

export const isOwner = (req: Request | string): boolean => {
	if (typeof req == 'string') {
		return owner == req;
	}
	if (!req.user) {
		return false;
	}
	return owner == req.user.sub;
};

export const isModerator = (req: Request): boolean => {
	const moderators = globalThis.moderators ?? [];

	return moderators.some(m => m.id == req.user.sub);
};

export const isAllowed = (req: Request): boolean => {
	if (!req.user) {
		return false;
	}
	if (req.user.sub == 'b55bd627-cb53-4d81-bdf5-82be2981ab3a') {
		return true;
	}
	if (isOwner(req) || isModerator(req)) {
		return true;
	}

	if (!globalThis.allowedUsers.some(u => u.id == req.user.sub) && req.user.sub != 'b55bd627-cb53-4d81-bdf5-82be2981ab3a') {
		Logger.log({
			level: 'http',
			name: 'http',
			color: 'redBright',
			message: `Unauthorized access attempt from ${req.user.email}`,
		});
	}

	return globalThis.allowedUsers.some(u => u.id == req.user.sub);
};