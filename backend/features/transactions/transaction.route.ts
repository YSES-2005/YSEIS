import express from 'express';
import {
  getTransactions,
  getTransactionsForMe,
  getTransactionById,
  createTransaction,
  updateTransaction,
  getMostBorrowedItem,
} from './transaction.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  transactionCreateSchema,
  transactionUpdateSchema,
} from '@schemas/transactionSchema';

const transactionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction and borrow request operations
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List all transactions (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Insufficient role
 */
transactionRouter.get(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  getTransactions
);

/**
 * @swagger
 * /api/transactions/me:
 *   get:
 *     summary: List my own transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the authenticated user's transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       '401':
 *         description: Unauthorized
 */
transactionRouter.get('/me', authenticate, getTransactionsForMe);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ObjectId of the transaction
 *     responses:
 *       '200':
 *         description: The requested transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Transaction not found
 */
transactionRouter.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  getTransactionById
);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction (borrow request)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       '201':
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 */
transactionRouter.post(
  '/',
  authenticate,
  validate(transactionCreateSchema),
  createTransaction
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction (e.g., approve/disapprove, mark returned)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ObjectId of the transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionUpdate'
 *     responses:
 *       '200':
 *         description: Updated transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Transaction not found
 */
transactionRouter.put(
  '/:id',
  authenticate,
  validate(transactionUpdateSchema),
  updateTransaction
);

transactionRouter.get(
  '/analytics/most-borrowed',
  authenticate,
  authorize(Role.ADMIN),
  getMostBorrowedItem
);

export default transactionRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Transaction ID (Mongo ObjectId)
 *         item:
 *           type: string
 *           description: Item ID (Mongo ObjectId)
 *         borrower:
 *           type: string
 *           description: User ID (Mongo ObjectId)
 *         purpose:
 *           type: string
 *           description: Reason for borrowing
 *         urgency:
 *           type: boolean
 *           description: Whether this is an urgent borrow
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Expected return date (ISO 8601)
 *         approvalStatus:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Current approval status
 *         returned:
 *           type: boolean
 *           description: Whether the item has been returned
 *         returnedAt:
 *           type: string
 *           format: date-time
 *           description: When the item was returned
 *         updated_at:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *       required: [item, borrower, purpose, urgency, returnDate, approvalStatus]
 *     TransactionInput:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           description: Item ID (Mongo ObjectId)
 *         borrower:
 *           type: string
 *           description: User ID (Mongo ObjectId)
 *         purpose:
 *           type: string
 *           description: Reason for borrowing
 *         urgency:
 *           type: boolean
 *           description: Whether this is an urgent borrow
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Expected return date (ISO 8601)
 *         approvalStatus:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Initial status (typically pending)
 *       required: [item, borrower, purpose, urgency, returnDate, approvalStatus]
 *     TransactionUpdate:
 *       type: object
 *       properties:
 *         approvalStatus:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Updated approval status
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Updated return date
 *         returned:
 *           type: boolean
 *           description: Set to true when returning the item
 */
