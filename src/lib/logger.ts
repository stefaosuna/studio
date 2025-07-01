
'use client';

import type { AppLog } from '@/lib/types';

const LOGS_STORAGE_KEY = 'cardify-logs';

export const addLog = (actor: string, message: string) => {
  if (typeof window === 'undefined') return;

  try {
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    const logs: AppLog[] = storedLogs ? JSON.parse(storedLogs) : [];
    
    const newLog: AppLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      actor,
      message,
    };

    const updatedLogs = [newLog, ...logs];
    
    // Limit log size to the latest 200 entries
    if (updatedLogs.length > 200) {
        updatedLogs.pop();
    }
    
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Failed to write to log", error);
  }
};
