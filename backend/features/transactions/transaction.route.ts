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

// Admin: list all transactions, admin only check if the user is admin
transactionRouter.get('/', authenticate, authorize(Role.ADMIN), getTransactions);

// Authenticated user: list own transactions for user
transactionRouter.get('/me', authenticate, getTransactionsForMe);

// Get single transaction by id for admin role only
transactionRouter.get('/:id', authenticate, authorize(Role.ADMIN), getTransactionById);

// Create a new transaction (borrow request) this is for user
transactionRouter.post('/', authenticate, createTransaction);

// Update a transaction: admin can change status returned or not
transactionRouter.put('/:id', authenticate, updateTransaction);

export default transactionRouter;
