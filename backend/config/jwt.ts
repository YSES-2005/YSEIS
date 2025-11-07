import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function userIdFromJWT(token: string): string | undefined {
  const payload = verifyToken(token);
  return payload?.sub ?? null;
}

export function roleFromJWT(token: string): string | undefined {
  const payload = verifyToken(token);
  return payload?.role ?? null;
}

export default { verifyToken, userIdFromJWT, roleFromJWT };