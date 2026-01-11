import NotificationModel from './notification.model';
import { UserModel } from '../users/user.model';
import { io } from '../../server';
import { sendEmail } from '../../services/email.service';

export const notify = async (
  recipientId: string,
  title: string,
  message: string,
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' = 'INFO',
  options?: {
    shouldEmail?: boolean;
    relatedEntityId?: string;
    relatedModel?: 'Item' | 'Transaction';
  }
) => {
  try {
    // persist to database
    const notification = await NotificationModel.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedEntityId: options?.relatedEntityId,
      relatedModel: options?.relatedModel,
    });

    if (io) {
      io.to(recipientId.toString()).emit('new_notification', notification);
    }

    if (options?.shouldEmail) {
      const user = await UserModel.findById(recipientId);
      // baguhin nyo nlng yung message format
      if (user && user.email) {
        const htmlContent = `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #333;">${title}</h2>
            <p style="font-size: 16px; color: #555;">${message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">
              This is an automated message from the Inventory System. 
              Please log in to view more details.
            </p>
          </div>
        `;

        sendEmail(user.email, title, htmlContent).catch(err =>
          console.error(`Failed to email user ${user.email}:`, err)
        );
      }
    }

    return notification;
  } catch (error) {
    console.error('Notification Service Error:', error);
    return null;
  }
};
