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
/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Inventory item operations
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: List all items
 *     tags: [Items]
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

itemsRouter.get('/:id', getItemById);

// Admin-only mutating endpoints
/**
 * @swagger
 * /items:
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
  validate(itemSchema),
  createItem
);

itemsRouter.put('/:id', authenticate, authorize(Role.ADMIN), validate(itemSchema), updateItem);
itemsRouter.delete('/:id', authenticate, authorize(Role.ADMIN), deleteItem);

export default itemsRouter;

/**
 * @swagger
 * /items/{id}:
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
 *       '404':
 *         description: Item not found
 */

/**
 * @swagger
 * /items/{id}:
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
 *         location:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, unavailable, deleted]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
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
 *         location:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, unavailable, deleted]
 *       required: [name, type, quantity, custodian, location, status, avatar]
 */
