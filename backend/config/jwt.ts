export function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const padded = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      '='
    );
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function userIdFromJWT(token: string): string | undefined {
  const payload = decodeJwtPayload(token);
  return payload?.sub ?? null;
}

export function roleFromJWT(token: string): string | undefined {
  const payload = decodeJwtPayload(token);
  return payload?.role ?? null;
}

export default { decodeJwtPayload, userIdFromJWT, roleFromJWT };
