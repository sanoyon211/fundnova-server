import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/app-error.js';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.config.js';
import { IUser, UserRole } from '../types/user.types.js';

interface JwtPayload {
  userId?: string;
  id?: string;
  email?: string;
  role?: string;
}

/**
 * Protect middleware: Extract JWT from Authorization header, verify signature,
 * find user in DB, and attach to req.user.
 */
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Access denied. No authentication token provided.', 401));
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    } catch (err) {
      return next(new AppError('Invalid or expired authentication token', 401));
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return next(new AppError('Invalid token payload', 401));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    const userObj = user.toObject();
    const formattedUser: IUser = {
      ...userObj,
      _id: user._id.toString(),
      role: userObj.role as UserRole,
    };

    req.user = formattedUser;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

/** Alias for protect middleware */
export const authenticate = protect;

/**
 * RestrictTo middleware: Restrict endpoint access based on user role(s).
 */
export const restrictTo = (...roles: (string | string[])[]) => {
  const allowedRoles = roles.flat();
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required prior to authorization check', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`,
          403
        )
      );
    }

    next();
  };
};

/** Alias for restrictTo middleware */
export const requireRole = restrictTo;
