import express from 'express';
import { getBorrowingTrends } from './analytics.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';

const analyticsRouter = express.Router();

analyticsRouter.get(
  '/borrowing-trends',
  authenticate,
  authorize(Role.ADMIN),
  getBorrowingTrends
);

export default analyticsRouter;
