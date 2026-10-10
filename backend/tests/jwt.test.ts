import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  verifyToken,
  userIdFromJWT,
  roleFromJWT,
} from '../config/jwt';

describe('JWT Utilities (backend/config/jwt.ts)', () => {
  it('correctly verifies a valid token and extracts payload', () => {
    const payload = { sub: 'user-123', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.sub).toBe('user-123');
    expect(verified?.role).toBe('admin');
  });

  it('returns null for an invalid or tampered token', () => {
    const invalidToken = 'invalid.jwt.token';
    expect(verifyToken(invalidToken)).toBeNull();

    const signedWithWrongSecret = jwt.sign(
      { sub: 'user-123', role: 'user' },
      'wrong-secret-key-12345678901234567890'
    );
    expect(verifyToken(signedWithWrongSecret)).toBeNull();
  });

  it('extracts userIdFromJWT correctly', () => {
    const token = jwt.sign({ sub: 'user-456', role: 'user' }, JWT_SECRET);
    expect(userIdFromJWT(token)).toBe('user-456');
    expect(userIdFromJWT('bad-token')).toBeUndefined();
  });

  it('extracts roleFromJWT correctly', () => {
    const token = jwt.sign({ sub: 'user-789', role: 'admin' }, JWT_SECRET);
    expect(roleFromJWT(token)).toBe('admin');
    expect(roleFromJWT('bad-token')).toBeUndefined();
  });
});
