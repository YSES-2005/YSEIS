
declare global {
  namespace Express {
    interface Request {
      token?: string | null;
      userId?: string | null;
      // userRole can be a string (e.g. 'admin'|'user') or null/undefined
      userRole?: string | null;
    }
  }
}

export {};
