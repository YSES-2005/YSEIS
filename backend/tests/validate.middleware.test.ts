import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';

describe('Validation Middleware (backend/middleware/validate.ts)', () => {
  const testSchema = z.object({
    name: z.string().min(1),
    quantity: z.number().int().min(1),
  });

  it('calls next() when request body satisfies schema', async () => {
    const req = {
      body: { name: 'Oscilloscope', quantity: 2 },
    } as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    const middleware = validate(testSchema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('returns 400 with zod field errors when body fails schema validation', async () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const req = {
      body: { name: '', quantity: -1 },
    } as Request;
    const res = { status } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    const middleware = validate(testSchema);
    await middleware(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Object),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
