import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { ENV } from '../config/env.config.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (ENV.NODE_ENV === 'development' && !(err instanceof AppError)) {
    console.error('[Error Details]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
