import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellDot, X, Clock, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { notificationService } from '../services/notification';
import { AppNotification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const loadNotifications = () => {
    setNotifications(notificationService.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    
    const handleUpdate = () => loadNotifications();
    window.addEventListener('logitrack_new_notification', handleUpdate);
    window.addEventListener('logitrack_notification_update', handleUpdate);
    
    return () => {
      window.removeEventListener('logitrack_new_notification', handleUpdate);
      window.removeEventListener('logitrack_notification_update', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: AppNotification) => {
    notificationService.markAsRead(notification.id);
    setIsOpen(false);
    navigate(`/admin/parcel/${notification.parcelId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
      >
        {unreadCount > 0 ? (
          <>
            <BellDot className="w-6 h-6 text-emerald-500" />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </>
        ) : (
          <Bell className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => notificationService.markAllAsRead()}
                    className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-all flex gap-3 ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className={`mt-1 p-2 rounded-lg shrink-0 ${!notif.isRead ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">No notifications yet</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button 
                onClick={() => notificationService.clearAll()}
                className="w-full p-3 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-t border-slate-50"
              >
                Clear all notifications
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
