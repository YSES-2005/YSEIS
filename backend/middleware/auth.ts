import express from 'express';
import { userIdFromJWT, roleFromJWT, verifyToken } from '../config/jwt';
import { UnauthorizedError } from '../errors';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
// Pang test lng magbabago pa once na nasetup na database
export const authenticate = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.header('Authorization') || req.header('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return next(new UnauthorizedError('Access denied. No token provided.'));
  }

  try {
    // verify token first; verifyToken returns null on failure
    const payload = verifyToken(token);
    if (!payload) {
      return next(new UnauthorizedError('Invalid token.'));
    }

    // attach token and derived fields for downstream handlers
    req.token = token;
    req.userId = payload.sub as any;
    req.userRole = payload.role as any;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token.'));
  }
};

export const authorize = (required: Role) => {
  return (
    req: express.Request,
    _: express.Response,
    next: express.NextFunction
  ) => {
    const role = req.userRole as Role | undefined;

    if (!role) {
      return next(new UnauthorizedError('Missing role'));
    }

    if (role !== required) {
      return next(new UnauthorizedError('Insufficient role'));
    }

    next();
  };
};
