import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { AppError } from '../errors/app-error.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    const user = await AuthService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Current user profile fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const socialLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, photoUrl, provider, role } = req.body;

    if (!email || !name) {
      throw new AppError('Email and name are required for social login', 400);
    }

    const result = await AuthService.socialLogin({
      name,
      email,
      photoUrl,
      provider: provider || 'social',
      role,
    });

    res.status(200).json({
      success: true,
      message: 'Social login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export class AuthController {
  static register = register;
  static login = login;
  static getMe = getMe;
  static socialLogin = socialLogin;
}
