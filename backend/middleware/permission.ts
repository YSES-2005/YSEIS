import express from 'express';
import { Role } from './auth';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '../errors';

// Simple role-based authorizer that checks the role present on the request.
// This avoids requiring the users model at build-time and is suitable for
// a development environment where the JWT contains the role claim.
export const authorize = (role: Role) => {
  if (!Object.values(Role).includes(role)) {
    throw new BadRequestError(`Role ${role} does not exist.`);
  }

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const userRole = req.userRole as Role | undefined;

    if (!userRole) {
      return next(new UnauthorizedError('Access denied. No role present.'));
    }

    if (userRole !== role) {
      return next(new ForbiddenError('Access denied. Insufficient permissions.'));
    }

    next();
  };
};
