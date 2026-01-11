import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller";
import { authenticate } from '../../middleware/auth';

const notificationsRouter = express.Router();

// Protect all notification routes
notificationsRouter.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification management
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of notifications to return
 *     responses:
 *       '200':
 *         description: List of notifications and unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [INFO, WARNING, SUCCESS, ERROR]
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 unreadCount:
 *                   type: integer
 *                   example: 5
 *       '401':
 *         description: Unauthorized
 */
notificationsRouter.get('/', getNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       '200':
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Notification not found
 *       '401':
 *         description: Unauthorized
 */
notificationsRouter.patch('/:id/read', markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All notifications marked as read
 *       '401':
 *         description: Unauthorized
 */
notificationsRouter.patch('/read-all', markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       '200':
 *         description: Notification deleted successfully
 *       '404':
 *         description: Notification not found
 *       '401':
 *         description: Unauthorized
 */
notificationsRouter.delete('/:id', deleteNotification);

export default notificationsRouter;