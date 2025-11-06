import { useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useOffline } from '../hooks/useOffline';

const SYNC_INTERVAL = 60000; // 1 minute

const useSync = () => {
    const { getData, saveData } = useIndexedDB();
    const { isOffline } = useOffline();

    useEffect(() => {
        const syncData = async () => {
            if (!isOffline) {
                const dataToSync = await getData('dataToSync');
                if (dataToSync) {
                    // Implement your sync logic here
                    // For example, send dataToSync to your API
                    await fetch('https://api.example.com/sync', {
                        method: 'POST',
                        body: JSON.stringify(dataToSync),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    // After successful sync, clear the data from IndexedDB
                    await saveData('dataToSync', null);
                }
            }
        };

        const intervalId = setInterval(syncData, SYNC_INTERVAL);

        return () => clearInterval(intervalId);
    }, [isOffline, getData, saveData]);
};

export default useSync;