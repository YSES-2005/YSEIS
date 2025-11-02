import express from 'express';

declare global {
  namespace Express {
    interface Request {
      token?: string | null;
      userId?: string | null;
      userRole?: string | null;
    }
  }
}

export {};
