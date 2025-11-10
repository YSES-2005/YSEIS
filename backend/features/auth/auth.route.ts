import { Router } from 'express';
import { register, login, logout } from './auth.controller';
import { validate } from '../../middleware/validate';
import { userSchema } from '@schemas/userSchema';
import { loginSchema } from '@schemas/loginSchema';
const authRouter = Router();

authRouter.post('/register', validate(userSchema), register);
// authRouter.post('/register', register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/logout', logout);

export default authRouter;
