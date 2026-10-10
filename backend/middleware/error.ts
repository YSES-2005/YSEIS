import express from 'express';
import {
  CustomError,
  BadRequestError,
  InternalError,
  UnprocessableEntityError,
} from '../errors';
import mongoose from 'mongoose';

export const errorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const handleInternalError = (
  e: Error | mongoose.Error,
  next: express.NextFunction
): void => {
  if (e instanceof mongoose.Error.ValidationError) {
    next(new UnprocessableEntityError(e.message));
  } else if (e instanceof mongoose.Error.CastError) {
    next(new BadRequestError(`Invalid value for ${e.path}: ${e.value}`));
  } else if (e instanceof mongoose.Error) {
    next(new InternalError('Database operation failed.'));
  } else {
    next(new InternalError());
  }
};
