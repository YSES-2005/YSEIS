import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../users/user.model';
import { BadRequestError, UnauthorizedError } from '../../errors';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/jwt';

//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
//  @param   {string} name, email, password, role, all from request body
//  @returns {object} 201 - JSON object with a success message
//  @returns {Error} 400 - If name/email/password are missing or if user already exists

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role, avatar } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError('Name, email and password are required');
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    const user = new UserModel({ name, email, password, role, avatar });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user, gets token, and sends the token to the client through cookies
// @route   POST /api/auth/login
// @access  Public
// @param
// @returns object 200 - JSON object with success message
// @returns Error 400 - If email or password are missing
// @returns Error 401 - If credentials are invalid

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      expiresIn: '120m',
    });

    res.cookie('jwt', token, {
      httpOnly: true, // JS cannot read this
      secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
      sameSite: 'strict', // Protects against CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (currently a placeholder)
// @route   POST /api/auth/logout
// @access  Public
// @returns object 200 - JSON object with a success message: 'Logged out successfully'

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out' });
};
