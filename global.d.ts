
declare global {
}

declare module 'express-serve-static-core' {
  interface Request extends Express.Request {
    isOwner: boolean;
    isModerator: boolean
    isAllowed: boolean;
  }
}

export {};
