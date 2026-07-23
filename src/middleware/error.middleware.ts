import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { ENV } from '../config/env.config.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    statusCode = 400;
    message = `Duplicate ${field} value entered. Please use another value.`;
  }

  // Handle Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // Handle JWT Validation Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  if (ENV.NODE_ENV === 'development' && !(err instanceof AppError)) {
    console.error('[Centralized Error Middleware]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
