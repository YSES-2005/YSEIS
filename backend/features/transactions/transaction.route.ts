import express from 'express';
import {
  getTransactions,
  getTransactionsForMe,
  getTransactionById,
  createTransaction,
  updateTransaction,
} from './transaction.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';

const transactionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction and borrow request operations
 */

/**
 * @swagger
 * /transactions:
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
 * /transactions/me:
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
 * /transactions/{id}:
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
 * /transactions:
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
transactionRouter.post('/', authenticate, createTransaction);

/**
 * @swagger
 * /transactions/{id}:
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
transactionRouter.put('/:id', authenticate, updateTransaction);

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
 *         return date:
 *           type: string
 *           format: date-time
 *           description: Expected return date
 *         approval_status:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Current approval status
 *         updated_at:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *       required: [item, borrower, purpose, urgency, return date, approval_status]
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
 *         return date:
 *           type: string
 *           format: date-time
 *           description: Expected return date
 *         approval_status:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Initial status (typically pending)
 *       required: [item, borrower, purpose, urgency, return date, approval_status]
 *     TransactionUpdate:
 *       type: object
 *       properties:
 *         approval_status:
 *           type: string
 *           enum: [approved, disapproved, pending]
 *           description: Updated approval status
 *         return date:
 *           type: string
 *           format: date-time
 *           description: Updated return date
 */
