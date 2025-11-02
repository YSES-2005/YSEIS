// Minimal JWT helpers that avoid external dependencies for compile-time stability.
// These helpers only decode the token payload (no signature verification).
// Suitable for development and tests; replace with a verified library in production.

export function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // add padding for base64
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function userIdFromJWT(token: string): string | null {
  const payload = decodeJwtPayload(token);
  return payload?.sub ?? null;
}

export function roleFromJWT(token: string): string | null {
  const payload = decodeJwtPayload(token);
  return payload?.role ?? null;
}

export default { decodeJwtPayload, userIdFromJWT, roleFromJWT };
