import { describe, it, expect } from 'vitest';
import {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalError,
  ServiceUnavailableError,
} from '../errors';

describe('Backend Error Hierarchy', () => {
  it('instantiates CustomError with custom message and code', () => {
    const error = new CustomError('Base error', 418);
    expect(error.statusCode).toBe(418);
    expect(error.message).toBe('Base error');
    expect(error.name).toBe('CustomError');
    expect(error).toBeInstanceOf(Error);
  });

  it('instantiates BadRequestError with default and custom message', () => {
    const defaultErr = new BadRequestError();
    expect(defaultErr.statusCode).toBe(400);
    expect(defaultErr.message).toBe('Bad Request');

    const customErr = new BadRequestError('Custom bad request');
    expect(customErr.statusCode).toBe(400);
    expect(customErr.message).toBe('Custom bad request');
  });

  it('instantiates UnauthorizedError with default and custom message', () => {
    const defaultErr = new UnauthorizedError();
    expect(defaultErr.statusCode).toBe(401);
    expect(defaultErr.message).toBe('Unauthorized');

    const customErr = new UnauthorizedError('Token expired');
    expect(customErr.statusCode).toBe(401);
    expect(customErr.message).toBe('Token expired');
  });

  it('instantiates ForbiddenError with default and custom message', () => {
    const defaultErr = new ForbiddenError();
    expect(defaultErr.statusCode).toBe(403);
    expect(defaultErr.message).toBe('Forbidden');

    const customErr = new ForbiddenError('Admin access only');
    expect(customErr.statusCode).toBe(403);
    expect(customErr.message).toBe('Admin access only');
  });

  it('instantiates NotFoundError with default and custom message', () => {
    const defaultErr = new NotFoundError();
    expect(defaultErr.statusCode).toBe(404);
    expect(defaultErr.message).toBe('Not Found');

    const customErr = new NotFoundError('Item missing');
    expect(customErr.statusCode).toBe(404);
    expect(customErr.message).toBe('Item missing');
  });

  it('instantiates ConflictError with default and custom message', () => {
    const defaultErr = new ConflictError();
    expect(defaultErr.statusCode).toBe(409);
    expect(defaultErr.message).toBe('Conflict');

    const customErr = new ConflictError('Item already borrowed');
    expect(customErr.statusCode).toBe(409);
    expect(customErr.message).toBe('Item already borrowed');
  });

  it('instantiates UnprocessableEntityError with default and custom message', () => {
    const defaultErr = new UnprocessableEntityError();
    expect(defaultErr.statusCode).toBe(422);
    expect(defaultErr.message).toBe('Unprocessable Entity');

    const customErr = new UnprocessableEntityError('Validation failed');
    expect(customErr.statusCode).toBe(422);
    expect(customErr.message).toBe('Validation failed');
  });

  it('instantiates TooManyRequestsError with default and custom message', () => {
    const defaultErr = new TooManyRequestsError();
    expect(defaultErr.statusCode).toBe(429);
    expect(defaultErr.message).toBe('Too Many Requests');

    const customErr = new TooManyRequestsError('Rate limit exceeded');
    expect(customErr.statusCode).toBe(429);
    expect(customErr.message).toBe('Rate limit exceeded');
  });

  it('instantiates InternalError with default and custom message', () => {
    const defaultErr = new InternalError();
    expect(defaultErr.statusCode).toBe(500);
    expect(defaultErr.message).toBe('Internal Server Error');

    const customErr = new InternalError('Database crashed');
    expect(customErr.statusCode).toBe(500);
    expect(customErr.message).toBe('Database crashed');
  });

  it('instantiates ServiceUnavailableError with default and custom message', () => {
    const defaultErr = new ServiceUnavailableError();
    expect(defaultErr.statusCode).toBe(503);
    expect(defaultErr.message).toBe('Service Unavailable');

    const customErr = new ServiceUnavailableError('Maintenance mode');
    expect(customErr.statusCode).toBe(503);
    expect(customErr.message).toBe('Maintenance mode');
  });
});
