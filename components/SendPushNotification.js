// /utils/notification.js
import axios from 'axios';
import { AppId, API_KEY } from '@/utils/constants';

export const sendPushNotification = async ({ message, userID, title = 'Reply Alert' }) => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: AppId,
        include_external_user_ids: [userID], // Array of user IDs
        contents: { en: message },
        headings: { en: title },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
