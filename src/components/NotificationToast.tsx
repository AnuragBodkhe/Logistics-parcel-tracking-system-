import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { notificationService } from '../services/notification';
import { AppNotification } from '../types';
import { Package, X } from 'lucide-react';

export const NotificationToast = () => {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    const handleNewNotification = () => {
      const notifications = notificationService.getNotifications();
      if (notifications.length > 0) {
        const latest = notifications[0];
        setActiveToast(latest);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
          setActiveToast(prev => prev?.id === latest.id ? null : prev);
        }, 5000);
      }
    };

    window.addEventListener('logitrack_new_notification', handleNewNotification);
    return () => window.removeEventListener('logitrack_new_notification', handleNewNotification);
  }, []);

  if (!activeToast) return null;

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-[100] w-80 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex gap-4 items-start"
        >
          <div className="bg-emerald-500 p-2 rounded-xl shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{activeToast.title}</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{activeToast.message}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-500 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
