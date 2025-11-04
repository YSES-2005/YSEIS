import express from 'express';
import { z, ZodError, ZodObject } from 'zod';

export const validate =
  (schema: ZodObject) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.dir(req.body);
      await schema.parseAsync({
        ...req.body,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: z.flattenError(error).fieldErrors,
        });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  };
