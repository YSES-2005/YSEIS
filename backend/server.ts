import { env } from './config/env';
import express, { Request, Response } from 'express';

import mongoose from 'mongoose';

mongoose.plugin(schema => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: any) => {
      delete ret._id;
      return ret;
    },
  });
});

import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import itemsRouter from './features/items/item.route';
import transactionRouter from './features/transactions/transaction.route';
import usersRouter from './features/users/user.route';
import authRouter from './features/auth/auth.route';
import notificationRouter from './features/notifications/notification.route';
import returnRouter from './features/returns/return.route';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/error';
import analyticsRouter from './features/analytics/analytics.route';
import { startNotificationScheduler } from './features/notifications/notification.cron';
import { setIO } from './lib/socket';

const app = express();

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL.replace(/\/$/, ''),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setIO(io);

io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('join_user_room', (userId: string) => {
    if (userId) {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Express Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true, // Allow cookies/headers to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/api/health', (_req: Request, res: Response) =>
  res.json({ status: 'ok' })
);

app.get('/', (_req: Request, res: Response) => {
  res.send('YSEIS API Running');
});

// Mount Feature Routers
app.use('/api/items', itemsRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/returns', returnRouter);

// Error Handler
app.use(
  (err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    errorHandler(err, res);
  }
);

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    startNotificationScheduler();
  })
  .catch(err => {
    console.error('Fatal: Failed to connect to MongoDB:', err.message || err);
    process.exit(1);
  });

const PORT = env.PORT;

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
