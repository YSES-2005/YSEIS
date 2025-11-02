import express from 'express';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { me, getUsers, getUserById } from './user.controller';

const usersRouter = express.Router();

// Authenticated user profile
usersRouter.get('/me', authenticate, me);

// Admin endpoints
usersRouter.get('/', authenticate, authorize(Role.ADMIN), getUsers);
usersRouter.get('/:id', authenticate, authorize(Role.ADMIN), getUserById);

export default usersRouter;
