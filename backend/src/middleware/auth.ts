import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { getUsersCollection } from '../config/database.js';
import type { UserDocument } from '../models/user.js';
import { hasPermission, isRole, type Permission } from '../rbac/permissions.js';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authorization = req.header('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length).trim();
    const payload = jwt.verify(token, getJwtSecret(), {
      issuer: 'lams-api',
      audience: 'lams-portal',
    }) as JwtPayload;
    if (typeof payload.sub !== 'string' || !payload.sub) {
      res.status(401).json({ error: 'Invalid or expired authentication.' });
      return;
    }

    const user = await getUsersCollection<UserDocument>().findOne({ user_id: payload.sub });
    if (!user || !user.is_active || !isRole(user.role)) {
      res.status(401).json({ error: 'Invalid or expired authentication.' });
      return;
    }

    req.authUser = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Invalid or expired authentication.' });
      return;
    }
    next(error);
  }
}

export function authorize(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      res.status(401).json({ error: 'Authentication is required.' });
      return;
    }
    if (!hasPermission(user.role, permission)) {
      res.status(403).json({ error: 'You do not have permission to access this module.' });
      return;
    }
    next();
  };
}

export { getJwtSecret };
