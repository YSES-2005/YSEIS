import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../users/user.model';
import { BadRequestError, UnauthorizedError } from '../../errors';
import jwt from 'jsonwebtoken';
import { object } from 'zod/v4/classic/external.cjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
//  @param   {string} email, password, role, all from request body
//  @returns {object} 201 - JSON object with a success message
//  @returns {Error} 400 - If email/password are missing or if user already exists
 
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

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
// @param 
// @returns object 200 - JSON object with the JWT: { token: '...' }
// @returns Error 400 - If email or password are missing
// @returns Error 401 - If credentials are invalid
 
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

// @desc    Logout user (currently a placeholder)
// @route   POST /api/auth/logout
// @access  Public
// @returns object 200 - JSON object with a success message: 'Logged out successfully' 

export const logout = (req: Request, res: Response) => {
  // This is a placeholder palang 
  res.json({ message: 'Logged out successfully' });
};
