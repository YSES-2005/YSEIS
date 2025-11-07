import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../users/user.model';
import { BadRequestError, UnauthorizedError } from '../../errors';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    const user = new UserModel({ email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {

  res.json({ message: 'Logged out successfully' });
};
