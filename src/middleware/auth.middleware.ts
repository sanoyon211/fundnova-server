import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { verifyToken } from '../utils/jwt.util.js';
import { User } from '../models/user.model.js';
import { UserRole, IUser } from '../types/user.types.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No authentication token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('Invalid token. User no longer exists.', 401);
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
      next(new AppError('Invalid or expired authentication token', 401));
    }
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required prior to authorization check', 401));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
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
