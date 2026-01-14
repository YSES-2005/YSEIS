import express from 'express';
import {
  getItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
  getInventoryStats,
} from './item.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { itemSchema, updateItemSchema } from '@schemas/itemSchema';

const itemsRouter = express.Router();

// If user didn't include a custodian, add the authenticated user's id
const fillCustodianFromAuth = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  if (!req.body) req.body = {};
  if (!req.body.custodian && req.userId) {
    req.body.custodian = req.userId;
  }
  next();
};
/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Inventory item operations
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: List items with optional filters
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Case-insensitive search by item name
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [available, unavailable]
 *         description: Filter by availability status
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by item type
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Include items updated on/after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Include items updated on/before this date (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
itemsRouter.get('/', getItems);

itemsRouter.get('/analytics/inventory-stats', getInventoryStats);

itemsRouter.get('/:id', getItemById);

// Admin-only mutating endpoints
/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       '201':
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 */
itemsRouter.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  fillCustodianFromAuth,
  validate(itemSchema),
  createItem
);

itemsRouter.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(updateItemSchema),
  updateItem
);
itemsRouter.delete('/:id', authenticate, authorize(Role.ADMIN), deleteItem);

export default itemsRouter;

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ObjectId of the item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       '200':
 *         description: Updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - Insufficient role (admin required)
 *       '404':
 *         description: Item not found
 */

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ObjectId of the item
 *     responses:
 *       '204':
 *         description: Item deleted
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Item not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Item ID (Mongo ObjectId)
 *           readOnly: true
 *         avatar:
 *           type: string
 *           format: uri
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 0
 *         custodian:
 *           type: string
 *           description: User ID (Mongo ObjectId)
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         location:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, unavailable, deleted]
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       required: [name, type, quantity, custodian, location, status, avatar]
 *     ItemInput:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: uri
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 0
 *         custodian:
 *           type: string
 *           description: User ID (Mongo ObjectId)
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         location:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, unavailable, deleted]
 *       required: [name, type, quantity, custodian, location, status, avatar]
 */
