import express from 'express';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { me, getUsers, getUserById } from './user.controller';

const usersRouter = express.Router();

// endpoint for authenticated user to get own info

usersRouter.get('/me', authenticate, me);

// endpoints for the admin
usersRouter.get('/', authenticate, authorize(Role.ADMIN), getUsers);
usersRouter.get('/:id', authenticate, authorize(Role.ADMIN), getUserById);

export default usersRouter;
