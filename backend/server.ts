import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import itemsRouter from './features/items/item.route';
import transactionRouter from './features/transactions/transaction.route';
import usersRouter from './features/users/user.route';
import authRouter from './features/auth/auth.route';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// swagger ui for docs purposes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (_req: Request, res: Response) =>
  res.json({ status: 'ok' })
);

app.get('/', (_req: Request, res: Response) => {
  res.send('Working ? Hello World! : Im cooked test');
});

// mount feature routers
app.use('/api/items', itemsRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  errorHandler(err, res);
});

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/inventory';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err =>
    console.warn('MongoDB connection warning:', err.message || err)
  );

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
