// src/api/notificationsService.js
import apiClient from './axiosConfig';

export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications.');
  }
};

export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data; // Backend should return a number
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch unread notifications count.');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/read`);
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to mark notification ${notificationId} as read.`);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await apiClient.patch('/notifications/mark-all-read');
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read.');
  }
};

