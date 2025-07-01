
"use client"

import { useState, useEffect, useCallback } from 'react';
import type { AppLog } from '@/lib/types';
import { toast } from './use-toast';

const LOGS_STORAGE_KEY = 'cardify-logs';

export const useLogStore = () => {
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLogs = () => {
      try {
        const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
        if (storedLogs) {
          const parsedLogs: AppLog[] = JSON.parse(storedLogs);
          const logsWithDates = parsedLogs.map(log => ({
              ...log,
              timestamp: new Date(log.timestamp)
          }));
          setLogs(logsWithDates);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error("Failed to load logs from localStorage", error);
        setLogs([]);
      }
      setIsLoaded(true);
    };

    loadLogs();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOGS_STORAGE_KEY) {
        loadLogs();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(LOGS_STORAGE_KEY);
    toast({ title: "Success!", description: "All logs have been cleared." });
  }, []);

  return { logs, isLoaded, clearLogs };
};
