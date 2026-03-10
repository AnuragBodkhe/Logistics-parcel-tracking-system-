import { AppNotification } from '../types';

const NOTIFICATION_KEY = 'logitrack_notifications';

export const notificationService = {
  getNotifications: (): AppNotification[] => {
    const data = localStorage.getItem(NOTIFICATION_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNotifications: (notifications: AppNotification[]): void => {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
  },

  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): void => {
    const notifications = notificationService.getNotifications();
    const newNotification: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    notifications.unshift(newNotification);
    notificationService.saveNotifications(notifications.slice(0, 50)); // Keep last 50
    
    // Dispatch custom event for real-time updates in components
    window.dispatchEvent(new CustomEvent('logitrack_new_notification'));
  },

  markAsRead: (id: string): void => {
    const notifications = notificationService.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].isRead = true;
      notificationService.saveNotifications(notifications);
      window.dispatchEvent(new CustomEvent('logitrack_notification_update'));
    }
  },

  markAllAsRead: (): void => {
    const notifications = notificationService.getNotifications();
    notifications.forEach(n => n.isRead = true);
    notificationService.saveNotifications(notifications);
    window.dispatchEvent(new CustomEvent('logitrack_notification_update'));
  },

  clearAll: (): void => {
    notificationService.saveNotifications([]);
    window.dispatchEvent(new CustomEvent('logitrack_notification_update'));
  }
};
