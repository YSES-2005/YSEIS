import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { authenticate, authorize, Role } from '../middleware/auth';
import { JWT_SECRET } from '../config/jwt';
import { UnauthorizedError } from '../errors';

interface AuthenticatedRequest extends Request {
  token?: string;
  userId?: string;
  userRole?: string;
}

describe('Auth Middleware (backend/middleware/auth.ts)', () => {
  describe('authenticate', () => {
    it('calls next with UnauthorizedError when no token is provided', () => {
      const req = {
        header: vi.fn().mockReturnValue(undefined),
        headers: {},
      } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('authenticates valid token from Authorization Bearer header', () => {
      const token = jwt.sign({ sub: 'user-1', role: 'admin' }, JWT_SECRET);
      const req = {
        header: vi.fn().mockReturnValue(`Bearer ${token}`),
        headers: {},
      } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.token).toBe(token);
      expect(req.userId).toBe('user-1');
      expect(req.userRole).toBe('admin');
    });

    it('authenticates valid token from raw Authorization header', () => {
      const token = jwt.sign({ sub: 'user-2', role: 'user' }, JWT_SECRET);
      const req = {
        header: vi.fn().mockReturnValue(token),
        headers: {},
      } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.userId).toBe('user-2');
    });

    it('authenticates valid token from cookie header', () => {
      const token = jwt.sign({ sub: 'user-3', role: 'user' }, JWT_SECRET);
      const req = {
        header: vi.fn().mockReturnValue(undefined),
        headers: { cookie: `other=123; jwt=${token}; extra=abc` },
      } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.userId).toBe('user-3');
    });

    it('calls next with UnauthorizedError when token is invalid', () => {
      const req = {
        header: vi.fn().mockReturnValue('Bearer invalid-token'),
        headers: {},
      } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('authorize', () => {
    it('calls next with UnauthorizedError when userRole is missing', () => {
      const req = {} as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authorize(Role.ADMIN)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('calls next with UnauthorizedError when userRole does not match required role', () => {
      const req = { userRole: Role.USER } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authorize(Role.ADMIN)(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('calls next with no error when userRole matches required role', () => {
      const req = { userRole: Role.ADMIN } as unknown as AuthenticatedRequest;
      const res = {} as Response;
      const next = vi.fn();

      authorize(Role.ADMIN)(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
