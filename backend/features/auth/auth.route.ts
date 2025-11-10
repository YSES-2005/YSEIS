import { Router } from 'express';
import { register, login, logout } from './auth.controller';
import { validate } from '../../middleware/validate';
import { userSchema } from '@schemas/userSchema';
const authRouter = Router();

authRouter.post('/register', validate(userSchema), register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;
