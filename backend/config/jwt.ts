import jwt from 'jsonwebtoken';
import { env } from './env';

export const JWT_SECRET = env.JWT_SECRET;

interface JWTPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function userIdFromJWT(token: string): string | undefined {
  const payload = verifyToken(token);
  return payload?.sub ?? undefined;
}

export function roleFromJWT(token: string): string | undefined {
  const payload = verifyToken(token);
  return payload?.role ?? undefined;
}

export default { verifyToken, userIdFromJWT, roleFromJWT };
