import React, { createContext, useState, useMemo, useEffect } from 'react';
import { initDB } from '../db';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [page, setPage] = useState('library');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initializeDB();
  }, []);

  const value = useMemo(() => ({
    page,
    setPage,
    db,
  }), [page, db]);

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};
