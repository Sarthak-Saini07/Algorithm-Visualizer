import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async.middleware';
import { sendSuccess, sendError } from '../utils/response';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const getSignedJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  const token = getSignedJwtToken(user._id as string);

  sendSuccess(res, { token }, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide an email and password', 'VALIDATION_ERROR', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendError(res, 'Invalid credentials', 'AUTH_ERROR', 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 'AUTH_ERROR', 401);
  }

  const token = getSignedJwtToken(user._id as string);

  sendSuccess(res, { token }, 'Login successful', 200);
});

export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, { user }, 'User retrieved successfully', 200);
});
