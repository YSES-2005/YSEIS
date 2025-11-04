import express from 'express';
import {
  getItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} from './item.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { itemSchema } from '@schemas/itemSchema';

const itemsRouter = express.Router();

// Public
itemsRouter.get('/', getItems);
itemsRouter.get('/:id', getItemById);

// Admin-only mutating endpoints
itemsRouter.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(itemSchema),
  createItem
);
itemsRouter.put('/:id', authenticate, authorize(Role.ADMIN), updateItem);
itemsRouter.delete('/:id', authenticate, authorize(Role.ADMIN), deleteItem);

export default itemsRouter;
