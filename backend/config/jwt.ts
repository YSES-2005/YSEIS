import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

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
