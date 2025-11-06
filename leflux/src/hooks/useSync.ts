import { useEffect } from 'react';
import { syncDataWithServer } from '../services/sync';

const useSync = () => {
  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncDataWithServer();
    }, 60000); // Sincroniza a cada 60 segundos

    return () => clearInterval(syncInterval); // Limpa o intervalo ao desmontar o hook
  }, []);

  return null; // Este hook não precisa retornar nada
};

export default useSync;