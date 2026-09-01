import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsersCollection } from '../config/database.js';
import { getJwtSecret } from '../middleware/auth.js';
import { toSafeUser, type UserDocument } from '../models/user.js';
import { isRole } from '../rbac/permissions.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const user = await getUsersCollection<UserDocument>().findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    if (!user.is_active) {
      res.status(403).json({ error: 'This account is inactive. Contact an administrator.' });
      return;
    }
    if (!isRole(user.role)) {
      res.status(403).json({ error: 'This account does not have an authorized role.' });
      return;
    }

    const token = jwt.sign({}, getJwtSecret(), {
      subject: user.user_id,
      expiresIn: '8h',
      issuer: 'lams-api',
      audience: 'lams-portal',
    });

    res.status(200).json({ token, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
}

export function me(req: Request, res: Response): void {
  res.status(200).json({ user: toSafeUser(req.authUser!) });
}

export function logout(_req: Request, res: Response): void {
  res.status(204).send();
}
