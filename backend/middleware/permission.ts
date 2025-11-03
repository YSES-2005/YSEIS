import express from 'express';
import { Role } from './auth';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '../errors';

// Will change once the the database is setup for testing lng
export const authorize = (role: Role) => {
  if (!Object.values(Role).includes(role)) {
    throw new BadRequestError(`Role ${role} does not exist.`);
  }

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {

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
