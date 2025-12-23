import express from 'express';
import { userIdFromJWT, roleFromJWT, verifyToken } from '../config/jwt';
import { UnauthorizedError } from '../errors';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export const authenticate = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.header('Authorization');
  let token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)jwt=([^;]*)/);
    if (match) {
      token = match[1];
    }
  }

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
    req.userId = payload.sub;
    req.userRole = payload.role;
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
