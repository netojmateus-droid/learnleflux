import { useEffect } from 'react';

export const useOfflineHandler = () => {
    useEffect(() => {
        const handleOffline = () => {
            // Logic to handle offline state
            console.log('You are now offline.');
            // Optionally, redirect to the offline page or show a notification
        };

        const handleOnline = () => {
            // Logic to handle online state
            console.log('You are back online.');
            // Optionally, sync data or update the UI
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);
};

export const isOffline = () => {
    return !navigator.onLine;
};