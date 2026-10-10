import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errorHandler, handleInternalError } from '../middleware/error';
import {
  BadRequestError,
  InternalError,
  UnprocessableEntityError,
} from '../errors';

describe('Error Middleware (backend/middleware/error.ts)', () => {
  describe('errorHandler', () => {
    it('delegates to next when res.headersSent is true', () => {
      const error = new Error('Streaming failure');
      const req = {} as Request;
      const res = { headersSent: true } as Response;
      const next = vi.fn() as unknown as NextFunction;

      errorHandler(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('handles CustomError by sending status and message', () => {
      const error = new BadRequestError('Invalid item ID');
      const json = vi.fn();
      const status = vi.fn().mockReturnValue({ json });
      const req = {} as Request;
      const res = { headersSent: false, status } as unknown as Response;
      const next = vi.fn() as unknown as NextFunction;

      errorHandler(error, req, res, next);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid item ID' });
    });

    it('handles unexpected errors by sending 500 status', () => {
      const error = new Error('Database crash');
      const json = vi.fn();
      const status = vi.fn().mockReturnValue({ json });
      const req = {} as Request;
      const res = { headersSent: false, status } as unknown as Response;
      const next = vi.fn() as unknown as NextFunction;

      errorHandler(error, req, res, next);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('handleInternalError', () => {
    it('maps mongoose ValidationError to UnprocessableEntityError', () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.message = 'Field is required';
      const next = vi.fn() as unknown as NextFunction;

      handleInternalError(validationError, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnprocessableEntityError));
    });

    it('maps mongoose CastError to BadRequestError', () => {
      const castError = new mongoose.Error.CastError(
        'ObjectId',
        'invalid',
        'item'
      );
      const next = vi.fn() as unknown as NextFunction;

      handleInternalError(castError, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('maps general mongoose error to InternalError with db message', () => {
      const genericMongooseError = new mongoose.Error(
        'Mongoose internal issue'
      );
      const next = vi.fn() as unknown as NextFunction;

      handleInternalError(genericMongooseError, next);

      expect(next).toHaveBeenCalledWith(expect.any(InternalError));
    });

    it('maps generic Error to InternalError', () => {
      const standardError = new Error('Something broke');
      const next = vi.fn() as unknown as NextFunction;

      handleInternalError(standardError, next);

      expect(next).toHaveBeenCalledWith(expect.any(InternalError));
    });
  });
});
