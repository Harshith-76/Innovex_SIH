import type { UserDocument } from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: UserDocument;
    }
  }
}

export {};
