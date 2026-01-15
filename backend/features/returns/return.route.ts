import express from 'express';
import {
    getReturns,
    getReturnById,
    createReturn,
    updateReturn,
} from './return.controller';
import { authenticate, authorize, Role } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
    returnCreateSchema,
    returnUpdateSchema,
} from '@schemas/returnSchema';

const returnRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Returns
 *   description: Return management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Return:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Return ID
 *         transaction:
 *           type: string
 *           description: Transaction ID
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, completed, damaged]
 *         condition:
 *           type: array
 *           items:
 *             type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *       required: [transaction, description, status]
 *     ReturnInput:
 *       type: object
 *       properties:
 *         transaction:
 *           type: string
 *           description: Transaction ID
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, completed, damaged]
 *         condition:
 *           type: array
 *           items:
 *             type: string
 *       required: [transaction, description]
 */

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Get all returns (Admin only)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of returns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Return'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
returnRouter.get('/', authenticate, authorize(Role.ADMIN), getReturns);

/**
 * @swagger
 * /api/returns/{id}:
 *   get:
 *     summary: Get return by ID
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Return'
 *       404:
 *         description: Return not found
 */
returnRouter.get('/:id', authenticate, getReturnById);

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Create a return
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnInput'
 *     responses:
 *       201:
 *         description: Return created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Return'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
returnRouter.post(
    '/',
    authenticate,
    authorize(Role.ADMIN),
    validate(returnCreateSchema),
    createReturn
);

/**
 * @swagger
 * /api/returns/{id}:
 *   put:
 *     summary: Update a return
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnInput'
 *     responses:
 *       200:
 *         description: Return updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Return'
 *       404:
 *         description: Return not found
 */
returnRouter.put(
    '/:id',
    authenticate,
    validate(returnUpdateSchema),
    updateReturn
);

export default returnRouter;
